# CLAUDE.md — build context for Replyo

This file gives an AI coding assistant (Claude Code, Cursor, Copilot, etc.) the
context to extend this project correctly. Also readable as `AGENTS.md`.

## What Replyo is

A personal Chrome extension (Manifest V3) that drafts client replies with AI, in the
user's voice, from inside WhatsApp Web. The user selects a client message, adds rough
points, and an AI model writes a polished reply that is inserted into the chat box for
review. Built for personal use, shared with a few friends — each person uses their own
API key. No backend server.

## Architecture (do not break these boundaries)

- **`src/background.js`** — the service worker, the "brain". It is the ONLY place the
  API key is read or used. It calls the AI model and relays keyboard commands. Never
  send the key to any other context.
- **`src/content.js`** — the "scraper/UI". Runs in the WhatsApp page. Reads the selected
  message, shows the in-page panel, and inserts the reply. It must NEVER receive or hold
  the key; it asks the background worker to generate via `chrome.runtime.sendMessage`.
- **`src/defaults.js`** — single source of truth for settings defaults. Loaded by the
  worker (`importScripts`) and the options page (`<script>`).
- **`src/options/`** — the settings page; writes to `chrome.storage.local`.
- **`src/panel/panel.css`** — styles for the injected panel; all selectors are
  `replyo-` prefixed to avoid clashing with WhatsApp.

## Hard rules

1. Keep the key in the background worker only. API calls never move to the content script.
2. Keep the fragile DOM selectors isolated in `CONFIG` at the top of `content.js`. When
   WhatsApp changes its HTML, only those should need fixing.
3. Request the minimum permissions. Do not add broad host permissions.
4. Zero build step for now — plain JS that loads unpacked. Introduce React/Vite only if
   a phase explicitly calls for it, and keep an unbuilt fallback working.
5. The model must never auto-send. Replyo only drafts and inserts; the user presses send.

## Provider switch

`handleGenerate()` in `background.js` branches on `settings.provider`. To add Claude or
OpenAI, add a `callClaude` / `callOpenAI` function and a branch — nothing else changes.
Request shapes for each provider are in `docs/providers-and-pricing.md`.

## Design docs (read before starting a phase)

Full system design lives in `docs/` — start at `docs/README.md`.

- `docs/architecture.md` — flow, components, principles
- `docs/features-and-settings.md` — features, settings, shortcuts
- `docs/providers-and-pricing.md` — providers and request shapes
- `docs/security.md` — key handling and permissions

## Roadmap

Phase 1 is done. Next up, each with scope, notes and acceptance criteria:

- `docs/phases/phase-2.md` — quick-intents, surrounding-message context grab, provider switch UI.
- `docs/phases/phase-3.md` — Flock web support, optional voice learning.

When a phase changes behavior, update its doc in the same change.

## Testing

Load unpacked at `chrome://extensions`, open `web.whatsapp.com`, and exercise:
select message → Alt+R → Generate → tone nudges → Insert. Check that a missing/invalid
API key surfaces a clear error in the panel status line, and that Insert falls back to
clipboard when the message box selector fails.
