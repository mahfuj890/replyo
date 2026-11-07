# Features, settings and shortcuts

The feature set starts small and grows by phase. See [phases](README.md#build-phases)
for what ships when.

## Core features

| Feature | Description | Phase |
| --- | --- | --- |
| Select-and-draft | Reads the selected client message and your points, returns a draft | 1 |
| Tone nudges | Regenerate the draft Shorter / Warmer / Firmer without retyping | 1 |
| Insert or copy | Drops the draft into the message box, with clipboard fallback | 1 |
| Quick-intents | One-tap buttons for your most common reply types | 2 |
| Context grab | Optionally pulls surrounding messages, tracking client vs you | 2 |
| Multi-provider | Gemini, Claude or OpenAI, chosen in settings | 2 |
| Flock support | Same flow on Flock web; panel adapts writing style per site | 3 |
| Voice learning | Learns from your edits to the draft | 3 |

## Settings

Configured on the settings page; stored in `chrome.storage.local`. Defaults live in
[`src/defaults.js`](../src/defaults.js).

| Setting | What it does |
| --- | --- |
| AI provider | Gemini, Claude or OpenAI |
| API key | Your own key for that provider, stored locally |
| Model | Which model to call |
| Thinking | How much the model reasons before replying: fast, balanced or deep |
| Style prompt | The description of your voice and the rules the model follows |
| Default tone | Friendly, formal or firm when you do not pick one |
| Context depth | Surrounding messages to pull (`0` = only the selected one) |
| Quick-intents | Your editable list of one-tap reply types |
| Insert mode | Insert into the box, or copy to clipboard only |

## Keyboard shortcuts

The design is keyboard-first so you never reach for the mouse mid-conversation.

Chrome allows an extension to suggest only **four** global command shortcuts. So the
main triggers are registered as commands, and the rest work while the panel is focused.

**Shipped (Phase 1)** — global commands, remappable at `chrome://extensions/shortcuts`:

| Shortcut | Action |
| --- | --- |
| Alt+R | Open the panel with the selected message loaded |
| Alt+G | Generate the reply |
| Alt+I | Insert the draft into the message box |

**Planned (Phase 2)** — in-panel keys, active while the panel is focused:

| Shortcut | Action |
| --- | --- |
| Ctrl+Enter | Generate the reply |
| Alt+1 / Alt+2 / Alt+3 | Run quick-intent 1, 2 or 3 |
| Alt+S / Alt+W / Alt+F | Tone nudge: shorter / warmer / firmer |
| Alt+C | Copy the draft to the clipboard |
| Esc | Close the panel |

A floating button in the page corner does the same as Alt+R, for when you would rather click.
