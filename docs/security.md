# Security design

Each person enters their own API key, and many extensions share one browser, so the key
is protected by design rather than by trust.

To report a vulnerability, see [SECURITY.md](../SECURITY.md).

## Rules

1. **The key lives in `chrome.storage.local`.** Never hardcoded, never synced to the
   cloud. Each user types their own in settings.
2. **API calls happen only in the background service worker** — never in a content
   script. This is the most important rule: the content script runs inside the chat
   page, where the page and other extensions could observe things, so the key must never
   enter that context.
3. **The content script only reads message text and types the reply.** It never sees or
   touches the key; it asks the worker to generate via `chrome.runtime.sendMessage`.
4. **Narrowest permissions possible.** `host_permissions` covers only the chat sites and
   the configured AI provider's API host — never an all-URLs permission.
5. **Manifest V3.** Stricter content-security policy and the service-worker model this
   design relies on.
6. **Never auto-send.** Replyo drafts and inserts; the user presses send.

## What this protects against

Other installed extensions cannot read this extension's storage — Chrome sandboxes
extensions from each other — so a random extension in the same browser cannot grab the key.

## Known limits

`chrome.storage` is protected from other extensions and from websites, but it is **not
encrypted on disk**. Anyone with access to the unlocked computer and Chrome profile could
extract it, as with most locally stored secrets. Mitigation is normal device hygiene
(lock your machine); a cautious user can delete the key in settings when done and
re-enter it next time.

## Data flow

The client message, your points and your style prompt are sent to the AI provider you
chose, using your own key. Nothing is sent to any other server; Replyo has no backend.
