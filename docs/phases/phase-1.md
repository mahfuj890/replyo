# Phase 1 — The core

**Status:** Done · **Goal:** the smallest thing that already removes the copy-paste loop.

## Scope

In:

- WhatsApp Web only.
- Take the selected message plus your typed points.
- Generate on Gemini's free tier.
- Show the draft in the panel with Copy and one-click Insert.
- Tone nudges (Shorter / Warmer / Firmer).
- Settings page: API key, model, style prompt, default tone, insert mode.
- Shortcuts: Alt+R (open), Alt+G (generate), Alt+I (insert).

Out (deferred):

- Surrounding-message context grab (`contextDepth` exists in defaults but is unused).
- Quick-intents.
- Provider switch UI and non-Gemini providers.
- Flock support.
- Voice learning.

## Delivered files

`manifest.json`, `src/background.js`, `src/content.js`, `src/defaults.js`,
`src/panel/panel.css`, `src/options/{html,js,css}`.

## Acceptance criteria

- [x] Select message → Alt+R → panel opens with the message loaded.
- [x] Generate returns a draft from Gemini.
- [x] Tone nudges regenerate the current draft.
- [x] Insert fills the WhatsApp message box; it never sends.
- [x] Insert falls back to the clipboard if the message-box selector fails.
- [x] A missing or invalid API key shows a clear error in the panel status line.
- [x] The key is only ever read in `background.js`.

## Known fragile points

WhatsApp Web's HTML is undocumented. If reading or inserting breaks, update
`CONFIG.messageInput` and `CONFIG.messageBubbles` at the top of `src/content.js`.
