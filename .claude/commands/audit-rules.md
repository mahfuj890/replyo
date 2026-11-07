---
description: Audit the codebase against the hard rules in CLAUDE.md
allowed-tools: Read, Grep, Glob
---

Audit Replyo against the "Hard rules" and "Architecture" sections of CLAUDE.md.
Read-only — report findings, do not edit anything.

Check each of these and report PASS or FAIL with `file:line` evidence:

1. **Key isolation** — the API key is read/used only in `src/background.js`. Grep
   `src/content.js` and `src/panel/` for `apiKey`, `x-goog-api-key`, `x-api-key`,
   and any `fetch(` to an AI provider. None should exist.
2. **Selectors isolated** — every WhatsApp DOM selector lives in `CONFIG` at the top
   of `src/content.js`; no inline `querySelector` strings elsewhere in that file.
3. **Minimal permissions** — `manifest.json` permissions are only `storage`, and
   `host_permissions` list only WhatsApp Web plus the configured AI provider hosts.
4. **No build step** — no `package.json` bundler, no imports that need compiling.
5. **Never auto-send** — nothing clicks the send button or dispatches Enter on the
   message box; Insert only fills the box (or falls back to clipboard).
6. **CSS prefix** — every selector in `src/panel/panel.css` starts with `replyo-`.

End with a short list of anything that FAILed and the smallest fix for each.
