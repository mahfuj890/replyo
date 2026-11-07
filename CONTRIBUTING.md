# Contributing to Replyo

Thanks for your interest. Replyo is a small personal project, so please keep changes
focused.

## Before you start

- Read [`docs/architecture.md`](docs/architecture.md) and the hard rules in
  [`CLAUDE.md`](CLAUDE.md).
- For anything larger than a small fix, open an issue first so we can agree on the
  approach. Planned work is tracked in [`docs/phases/`](docs/phases/).

## Ground rules

These are not negotiable; PRs that break them will be asked to change.

1. **The API key stays in `src/background.js`.** Never read, pass or log it from a
   content script or the options page beyond saving it to `chrome.storage.local`.
2. **Fragile DOM selectors live in `CONFIG`** at the top of `src/content.js`.
3. **Minimum permissions.** No broad host permissions or new permissions without a
   clear reason.
4. **No build step.** Plain JavaScript that loads unpacked. No bundler or dependencies
   unless a phase explicitly calls for it.
5. **Never auto-send.** Replyo drafts and inserts; the user presses send.
6. Panel CSS selectors must be `replyo-` prefixed.

## Setup

No install step.

1. Fork and clone the repo.
2. Open `chrome://extensions`, enable **Developer mode**, click **Load unpacked**, and
   select the repo folder.
3. Add your own API key on the settings page (a free Gemini key works).
4. After editing code, click the reload icon on the extension card.

## Testing

There is no automated suite yet. Check syntax, then test by hand:

```
node --check src/background.js
node --check src/content.js
node --check src/options/options.js
```

Then on `web.whatsapp.com`: select a message → Alt+R → Generate → tone nudges → Insert.
Also confirm that:

- a missing or invalid API key shows a clear error in the panel status line;
- Insert falls back to the clipboard when the message-box selector fails;
- nothing is ever sent automatically.

## Pull requests

- Keep each PR to one change. Describe what and why, and how you tested it.
- Match the existing style: plain ES2022, small functions, comments only where the
  reason isn't obvious.
- Update the relevant file in `docs/` if you change behavior.
- Add a line to [`CHANGELOG.md`](CHANGELOG.md) under **Unreleased**.
- Never include API keys, personal chat content or screenshots of real conversations.

## Reporting bugs

Use the bug-report issue template. If WhatsApp changed its page and Replyo stopped
reading or inserting, say so — it is usually a selector fix in `CONFIG`.

For security issues, see [SECURITY.md](SECURITY.md) instead.

## License

By contributing you agree your work is released under the [MIT License](LICENSE).
