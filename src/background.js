// Replyo — background service worker.
//
// SECURITY: the API key lives ONLY here. The content script never receives it.
// This worker holds the key, calls the AI model, and relays keyboard commands.

importScripts("defaults.js");

// --- Settings ---------------------------------------------------------------

async function getSettings() {
  const keys = Object.keys(self.REPLYO_DEFAULTS);
  const stored = await chrome.storage.local.get(keys);
  return { ...self.REPLYO_DEFAULTS, ...stored };
}

// Open the settings page when the toolbar icon is clicked.
chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});

// --- Keyboard commands ------------------------------------------------------
// Commands fire here, in the background. We forward them to the active
// WhatsApp tab's content script, which owns the panel and the DOM.

chrome.commands.onCommand.addListener(async (command) => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.id) return;
  try {
    await chrome.tabs.sendMessage(tab.id, { type: "command", command });
  } catch (e) {
    // Content script not present (not on WhatsApp Web) — ignore quietly.
  }
});

// --- Generation -------------------------------------------------------------

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg && msg.type === "generate") {
    handleGenerate(msg.payload)
      .then(sendResponse)
      .catch((err) => sendResponse({ ok: false, error: err?.message || String(err) }));
    return true; // keep the message channel open for the async response
  }
});

async function handleGenerate(payload) {
  const settings = await getSettings();
  if (!settings.apiKey) {
    return { ok: false, error: "No API key set. Open Replyo settings and add your Gemini API key." };
  }
  const prompt = buildPrompt(settings, payload);

  // The provider switch. Add "claude" / "openai" branches here later —
  // the rest of the extension does not change.
  if (settings.provider === "gemini") {
    const draft = await callGemini(settings, prompt);
    return { ok: true, draft };
  }
  return { ok: false, error: `Unknown provider: ${settings.provider}` };
}

function buildPrompt(settings, payload) {
  const tone = payload.tone || settings.tone;
  const platform = payload.platform || "whatsapp";
  return [
    settings.stylePrompt,
    "",
    `PLATFORM: ${platform}`,
    `TONE: ${tone}`,
    "",
    "CLIENT MESSAGE:",
    payload.clientMessage || "(none provided)",
    "",
    "MY POINTS:",
    payload.points || "(no points — infer a sensible, safe reply)",
    "",
    "Write only the reply text."
  ].join("\n");
}

// --- Gemini call ------------------------------------------------------------

async function callGemini(settings, prompt) {
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/" +
    encodeURIComponent(settings.model) +
    ":generateContent";

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": settings.apiKey
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7 }
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini API ${res.status}: ${text.slice(0, 300)}`);
  }

  const data = await res.json();
  const draft =
    data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ?? "";
  if (!draft) {
    throw new Error("Gemini returned no text. Try a different model in settings.");
  }
  return draft.trim();
}
