// Replyo — settings page logic. Loads/saves to chrome.storage.local.

const FIELDS = ["provider", "apiKey", "model", "thinkingMode", "tone", "insertMode", "stylePrompt"];

function $(id) {
  return document.getElementById(id);
}

async function load() {
  const defaults = window.REPLYO_DEFAULTS;
  const stored = await chrome.storage.local.get(Object.keys(defaults));
  const v = { ...defaults, ...stored };
  FIELDS.forEach((key) => {
    const el = $(key);
    if (el) el.value = v[key];
  });
}

async function save() {
  const patch = {};
  FIELDS.forEach((key) => {
    const el = $(key);
    if (el) patch[key] = el.value;
  });
  await chrome.storage.local.set(patch);
  const status = $("status");
  status.textContent = "Saved.";
  setTimeout(() => (status.textContent = ""), 1500);
}

function openShortcuts() {
  // Chrome does not allow an extension to rebind its own shortcuts directly;
  // this opens the official page where the user changes them.
  chrome.tabs.create({ url: "chrome://extensions/shortcuts" });
}

document.addEventListener("DOMContentLoaded", () => {
  load();
  $("save").addEventListener("click", save);
  $("shortcuts").addEventListener("click", openShortcuts);
});
