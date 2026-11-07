# Phase 3 — Reach and refinement

**Status:** Planned · **Goal:** support a second chat platform and make drafts sound
more like you over time.

## Scope

1. **Flock web support** — a new content-script match and its own selectors. The panel
   auto-detects which site it is on and adjusts the writing style.
2. **Voice learning (optional, opt-in)** — save the user's edits (draft vs what they
   actually sent) and feed them back into the style prompt.

## Implementation notes

### Flock

- Add the Flock origin to `content_scripts.matches` and `host_permissions` — that one
  origin only.
- Keep per-site selectors in `CONFIG`, keyed by site, so a layout change on either
  platform is a selector fix only.
- Add a per-site style hint (WhatsApp: shorter, more casual, line breaks; Flock: more
  workplace-chat) as a prefix to the style prompt. Defaults go in `src/defaults.js`.
- Re-verify the insert path and the clipboard fallback on the new site.

### Voice learning

- Opt-in via a setting, off by default.
- Store pairs of `{ draft, edited }` locally in `chrome.storage.local`. Do not send them
  anywhere except as part of the prompt to the user's chosen provider.
- Summarise recurring edits into a few style rules appended to the style prompt, instead
  of pasting raw history, to keep token cost down.
- Give the user a way to view and clear what has been saved.
- Never read what the user sends beyond comparing it to the draft Replyo inserted.

## Constraints (unchanged)

- Key stays in the background worker only.
- Minimum permissions; no all-URLs.
- Never auto-send.

## Acceptance criteria

- [ ] On Flock, select → panel → generate → insert works end to end.
- [ ] Each site uses its own selectors; breaking one does not affect the other.
- [ ] With voice learning off, nothing about edits is stored.
- [ ] With it on, saved edits can be viewed and cleared from settings.
- [ ] `manifest.json` adds only the Flock origin.
