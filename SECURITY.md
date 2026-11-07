# Security policy

Replyo handles a personal AI API key, so security reports are taken seriously.

## Reporting a vulnerability

**Please do not open a public issue for a security problem.**

Use GitHub's private reporting instead: go to the repository's **Security** tab and click
**Report a vulnerability**. Include what you found, how to reproduce it, and the impact.

This is a personal project maintained in spare time. Expect an acknowledgement within
about a week; fixes are made as quickly as practical.

## Supported versions

Only the latest release on the default branch is supported.

## Scope

Of particular interest:

- Anything that exposes the API key outside the background service worker
  (for example to a content script, the page, or another extension).
- Any path that sends a message without the user pressing send.
- Permissions broader than needed.

Out of scope: a person with access to your unlocked computer and Chrome profile reading
`chrome.storage.local`. This is a documented limit; see
[docs/security.md](docs/security.md#known-limits).

## Your own key

Replyo ships with no key. Never commit an API key to this repository. If you think a key
leaked, revoke it with your provider immediately.
