# Phase 2 — The polish

**Status:** Planned · **Goal:** make Replyo fast to use daily and not tied to one provider.

## Scope

1. **Quick-intents** — an editable list of one-tap reply types (for example "timeline
   update", "payment follow-up"). Often removes the need to type points at all.
2. **Surrounding-message context grab** — read `contextDepth` messages around the
   selection via `CONFIG.messageBubbles`, tracking who said what (client vs you).
   Must **fall back safely to the selected text only** if the selector fails.
3. **Provider switch** — Gemini / Claude / OpenAI chosen in settings, with a UI in the
   options page.
4. **Full settings page** — expose every field in
   [features and settings](../features-and-settings.md#settings).
5. **In-panel shortcuts** — the planned key set in
   [features and settings](../features-and-settings.md#keyboard-shortcuts).

## Implementation notes

- **Quick-intents:** store as an array in `chrome.storage.local`; add defaults in
  `src/defaults.js` only. Render as buttons in the panel; each sends its intent text as
  the "points" to the existing generate path.
- **Context grab:** keep it in `content.js`, selectors in `CONFIG`. Send the message
  list to the worker as plain text with speaker labels; never send DOM nodes.
- **Provider switch:** add `callClaude` / `callOpenAI` and a branch in `handleGenerate()`.
  Add only the new provider's host to `host_permissions`. See
  [providers](../providers-and-pricing.md#provider-switch).
- **Shortcuts:** Chrome allows only four suggested global commands. Keep the globals to
  the essentials and handle the rest with `keydown` listeners scoped to the panel.

## Constraints (unchanged)

- Key stays in the background worker only.
- No broad host permissions.
- No build step; plain JS.
- Never auto-send.

## Acceptance criteria

- [ ] A quick-intent generates a draft in one tap, with no typed points.
- [ ] With `contextDepth > 0`, the prompt includes labelled surrounding messages.
- [ ] If the bubble selector fails, generation still works from the selected text.
- [ ] Switching provider in settings changes which API is called, with no other code change.
- [ ] A missing or invalid key surfaces a clear error for every provider.
- [ ] `manifest.json` lists only the hosts actually in use.
