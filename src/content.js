// Replyo — content script (WhatsApp Web).
//
// Builds the in-page panel, reads the selected message, and inserts the reply.
// It NEVER handles the API key — it asks the background worker to generate.
//
// FRAGILE PART: the two selectors below are the only things that break when
// WhatsApp changes its HTML. If reading or inserting stops working, fix them here.
const CONFIG = {
  messageInput: 'footer div[contenteditable="true"]',
  messageBubbles: "div.message-in, div.message-out" // reserved for Phase 2 context grab
};

let panelEl = null;

function init() {
  chrome.runtime.onMessage.addListener((msg) => {
    if (!msg || msg.type !== "command") return;
    if (msg.command === "open-panel") openPanel();
    if (msg.command === "generate") doGenerate();
    if (msg.command === "insert-draft") doInsert();
  });
  addFloatingButton();
}

function getSelectionText() {
  const sel = window.getSelection && window.getSelection().toString().trim();
  return sel || "";
}

function addFloatingButton() {
  if (document.getElementById("replyo-fab")) return;
  const btn = document.createElement("button");
  btn.id = "replyo-fab";
  btn.textContent = "Replyo";
  btn.title = "Open Replyo (Alt+R)";
  btn.addEventListener("click", openPanel);
  document.body.appendChild(btn);
}

function openPanel() {
  if (!panelEl) buildPanel();
  const selected = getSelectionText();
  if (selected) panelEl.querySelector("#replyo-client").value = selected;
  panelEl.classList.add("open");
  panelEl.querySelector("#replyo-points").focus();
}

function closePanel() {
  if (panelEl) panelEl.classList.remove("open");
}

function buildPanel() {
  panelEl = document.createElement("div");
  panelEl.id = "replyo-panel";
  panelEl.innerHTML = [
    '<div class="replyo-head"><span>Replyo</span><button id="replyo-close" title="Close (Esc)">×</button></div>',
    '<label class="replyo-label">Client message</label>',
    '<textarea id="replyo-client" rows="3" placeholder="Select a message, or paste it here"></textarea>',
    '<label class="replyo-label">Your points</label>',
    '<textarea id="replyo-points" rows="3" placeholder="Rough points for the reply"></textarea>',
    '<div class="replyo-row">',
    '  <select id="replyo-tone">',
    '    <option value="friendly">Friendly</option>',
    '    <option value="formal">Formal</option>',
    '    <option value="firm">Firm</option>',
    "  </select>",
    '  <button id="replyo-generate" class="replyo-primary">Generate</button>',
    "</div>",
    '<label class="replyo-label">Draft</label>',
    '<textarea id="replyo-draft" rows="5" placeholder="The reply appears here"></textarea>',
    '<div class="replyo-row replyo-tones">',
    '  <button data-nudge="shorter">Shorter</button>',
    '  <button data-nudge="warmer">Warmer</button>',
    '  <button data-nudge="firmer">Firmer</button>',
    "</div>",
    '<div class="replyo-row">',
    '  <button id="replyo-copy">Copy</button>',
    '  <button id="replyo-insert" class="replyo-primary">Insert</button>',
    "</div>",
    '<div id="replyo-status" class="replyo-status"></div>'
  ].join("");
  document.body.appendChild(panelEl);

  panelEl.querySelector("#replyo-close").addEventListener("click", closePanel);
  panelEl.querySelector("#replyo-generate").addEventListener("click", () => doGenerate());
  panelEl.querySelector("#replyo-copy").addEventListener("click", doCopy);
  panelEl.querySelector("#replyo-insert").addEventListener("click", doInsert);
  panelEl.querySelectorAll(".replyo-tones button").forEach((b) =>
    b.addEventListener("click", () => doGenerate(b.dataset.nudge))
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panelEl && panelEl.classList.contains("open")) closePanel();
  });
}

function setStatus(text, isError) {
  const s = panelEl && panelEl.querySelector("#replyo-status");
  if (s) {
    s.textContent = text;
    s.className = "replyo-status" + (isError ? " error" : "");
  }
}

async function doGenerate(nudge) {
  if (!panelEl) openPanel();
  const clientMessage = panelEl.querySelector("#replyo-client").value.trim();
  let points = panelEl.querySelector("#replyo-points").value.trim();
  const tone = panelEl.querySelector("#replyo-tone").value;

  if (typeof nudge === "string") {
    const current = panelEl.querySelector("#replyo-draft").value.trim();
    points += `\n\nRevise this current draft to be ${nudge}:\n${current}`;
  }

  setStatus("Generating…");
  try {
    const resp = await chrome.runtime.sendMessage({
      type: "generate",
      payload: { clientMessage, points, tone, platform: "whatsapp" }
    });
    if (!resp || !resp.ok) throw new Error((resp && resp.error) || "Unknown error");
    panelEl.querySelector("#replyo-draft").value = resp.draft;
    setStatus("Draft ready — review before sending.");
  } catch (e) {
    setStatus(e.message || String(e), true);
  }
}

async function doCopy() {
  const draft = panelEl && panelEl.querySelector("#replyo-draft").value;
  if (!draft) {
    setStatus("Nothing to copy.", true);
    return;
  }
  await navigator.clipboard.writeText(draft);
  setStatus("Copied to clipboard.");
}

function doInsert() {
  const draft = (panelEl && panelEl.querySelector("#replyo-draft").value) || "";
  if (!draft) {
    setStatus("Nothing to insert.", true);
    return;
  }
  const box = document.querySelector(CONFIG.messageInput);
  if (!box) {
    navigator.clipboard.writeText(draft);
    setStatus("Message box not found — copied to clipboard instead.", true);
    return;
  }
  box.focus();

  // Prefer a synthetic paste: WhatsApp's own paste handler converts the "\n"
  // newlines into real line breaks (so multi-paragraph drafts keep their shape)
  // and paste never sends the message. execCommand("insertText") collapses the
  // newlines into one line, so it's only the fallback for older browsers.
  if (insertViaPaste(box, draft)) {
    setStatus("Inserted — review and send.");
    return;
  }

  const ok = document.execCommand("insertText", false, draft);
  if (!ok) {
    navigator.clipboard.writeText(draft);
    setStatus("Could not type into the box — copied to clipboard instead.", true);
    return;
  }
  setStatus("Inserted — review and send.");
}

// Dispatch a paste event carrying the draft. Returns false if this browser
// won't let us build the event's clipboard data, so the caller can fall back.
function insertViaPaste(box, text) {
  try {
    const data = new DataTransfer();
    data.setData("text/plain", text);
    const ev = new ClipboardEvent("paste", {
      clipboardData: data,
      bubbles: true,
      cancelable: true
    });
    // Some older Chromium builds null out clipboardData on synthetic events.
    if (!ev.clipboardData || ev.clipboardData.getData("text/plain") !== text) {
      return false;
    }
    box.dispatchEvent(ev);
    return true;
  } catch (e) {
    return false;
  }
}

init();
