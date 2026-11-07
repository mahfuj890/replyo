// Replyo — single source of truth for settings defaults.
// Loaded by the background worker (importScripts) and the options page (<script>).

const REPLYO_DEFAULTS = {
  // Which AI provider to call. Phase 1 ships Gemini; the engine is written
  // so Claude / OpenAI can be added as extra branches later.
  provider: "gemini",

  // Each user pastes their OWN key here via the settings page. Never shipped.
  apiKey: "",

  // Gemini model id. Pick a current free-tier model from Google AI Studio.
  // Good free choices have included: gemini-2.5-flash, gemini-2.5-flash-lite.
  // If you get a 404 "model not found", change this to a model your key can see.
  model: "gemini-2.5-flash",

  // Default tone when you don't pick one in the panel.
  tone: "friendly",

  // "insert" drops the draft into the chat box; "copy" puts it on the clipboard.
  insertMode: "insert",

  // How many surrounding messages to pull as context (Phase 2 feature).
  contextDepth: 0,

  // The voice + rules the model follows. Edit this to sound like you.
  stylePrompt: [
    "You are Replyo, a client-communication assistant for a freelance developer",
    "who talks to clients on WhatsApp and Flock.",
    "",
    "You are given the CLIENT MESSAGE and MY POINTS (rough notes).",
    "Turn them into a finished reply the developer can send as themselves.",
    "",
    "Rules:",
    "- Write the reply only. No preamble, no explanation, no quotes around it.",
    "- Clear, warm, professional; confident but not stiff.",
    "- Keep it concise. Lead with the answer.",
    "- Plain, correct English; smooth over any awkward phrasing in the points.",
    "- Never over-promise. Keep any dates, numbers, or scope exactly as stated; do not invent them.",
    "- WhatsApp style: shorter, slightly casual, prefer line breaks over long paragraphs.",
    "- If the points are empty, infer a safe, helpful reply and, if needed, ask one short clarifying question."
  ].join("\n")
};

// Expose it to whichever context loads this file.
if (typeof self !== "undefined") {
  self.REPLYO_DEFAULTS = REPLYO_DEFAULTS;
}
