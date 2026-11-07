# Architecture

## Overview

Replyo drafts client replies in your voice, on demand, without leaving the chat window.
You select a client's message in WhatsApp Web (Flock planned), add a few rough points,
and an AI model writes a polished reply that is inserted into the message box. You
review it and press send yourself.

It is built for personal use and for sharing with a few friends. Each person installs it
and enters their own AI API key in settings, so no key is shared and no server is needed.

**The problem it solves:** copy the client's message, switch windows, write your points,
copy the reply, switch back — four context switches per message. Replyo collapses that
into one place.

**In one line:** a content script reads the client's message off the page, a background
service worker sends it plus your points to an AI model, and the generated reply is
inserted into the chat box for review.

## End-to-end flow

1. Open WhatsApp Web with a client conversation on screen.
2. Select the client message you want to answer. In a busy group, selecting one message
   is how you tell Replyo which thread to focus on.
3. Press **Alt+R** or click the floating button. The panel opens with the message loaded.
4. Type your rough points (Phase 2 adds one-tap quick-intents).
5. Click **Generate**. The panel passes the message, your points and your saved style
   prompt to the background worker, which calls the AI model.
6. The draft appears in the panel. Click a tone nudge (Shorter / Warmer / Firmer) to
   regenerate instead of retyping.
7. Click **Insert**. The draft goes into the message box. Read it, tweak it, send it.

**Nothing is ever sent automatically.** Replyo writes into the box; the user presses send.

## Components

```
 WhatsApp Web page
 ┌──────────────────────────────┐
 │ content.js  (scraper + UI)   │   chrome.runtime.sendMessage
 │  - reads selected message    │ ───────────────┐
 │  - shows the panel           │                │
 │  - inserts the reply         │ ◄──────────────┤ draft text
 └──────────────────────────────┘                │
                                                 ▼
                              ┌──────────────────────────────┐
                              │ background.js (service worker)│
                              │  - ONLY place the key is used │ ──► AI provider API
                              │  - calls the model            │ ◄── (Gemini / Claude / OpenAI)
                              │  - relays keyboard commands   │
                              └──────────────────────────────┘
                                          ▲
                              chrome.storage.local
                                          ▲
                              ┌──────────────────────────────┐
                              │ options page (settings)      │
                              └──────────────────────────────┘
```

| File | Role |
| --- | --- |
| `src/background.js` | Service worker. Reads the API key, calls the model, relays keyboard commands. |
| `src/content.js` | Runs in the chat page. Reads the selection, renders the panel, inserts the reply. Never sees the key. |
| `src/defaults.js` | Single source of truth for settings defaults. Loaded by the worker and the options page. |
| `src/options/` | Settings page. Writes to `chrome.storage.local`. |
| `src/panel/panel.css` | Panel styles. Every selector is `replyo-` prefixed so it cannot clash with the host page. |

## Design principles

- **Scraper and brain are separate.** The fragile DOM selectors live in `CONFIG` at the
  top of `content.js`; the engine lives in the background worker. A WhatsApp or Flock
  HTML change should only ever mean fixing selectors, never the engine.
- **One swappable engine.** Providers differ by a single function each, chosen by
  `settings.provider` (see [AI providers](providers-and-pricing.md)).
- **Draft, never send.** The model output is a suggestion the user reviews.
- **Least privilege.** Narrowest possible permissions (see [Security](security.md)).

## Tech stack

- Chrome extension, Manifest V3.
- Vanilla JavaScript (ES2022), no bundler, no build step — load the folder unpacked.
- MV3 background service worker (`importScripts`).
- `chrome.storage.local`, `chrome.commands`, `chrome.runtime` messaging.
- Fetch API against the provider's REST endpoint.
- HTML/CSS for the in-page panel and the settings page.
- Possible later: a React + Vite panel, only if a phase explicitly calls for it. An
  unbuilt fallback must keep working.
