---
description: Add a new AI provider (Claude or OpenAI) to the provider switch
argument-hint: <claude|openai>
---

Add the `$ARGUMENTS` provider to Replyo, following the "Provider switch" section
of CLAUDE.md exactly:

1. In `src/background.js`, add a `call<Provider>` function and a branch in
   `handleGenerate()` on `settings.provider`. Nothing else in the generate flow changes.
2. Use the request shape documented in CLAUDE.md for that provider.
3. Add the provider's API host to `host_permissions` in `manifest.json` — only that
   one host, nothing broader.
4. Add any new defaults (model name, etc.) to `src/defaults.js` only.
5. Expose the choice in `src/options/` (provider selector + key field), writing to
   `chrome.storage.local`.
6. Keep the key in the background worker; do not touch `src/content.js`.

Surface a clear error in the panel status line for a missing/invalid key. When done,
list the files changed and how to test it (load unpacked → Alt+R → Generate).
