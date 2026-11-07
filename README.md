# Replyo

Draft client replies with AI, in your voice, right inside WhatsApp Web. You select
a client's message, add a few points, and Replyo writes a polished reply you review
and send. On-demand, in one place — no more copy / switch / paste.

This is the **Phase 1** starter: WhatsApp Web, Google Gemini (free tier), zero build step.

---

## Technologies used

| Layer | Technology |
| --- | --- |
| Extension platform | Chrome Extension, **Manifest V3** |
| Language | **Vanilla JavaScript (ES2022)** — no bundler, no build step |
| Background | MV3 **service worker** (`importScripts`) |
| Chrome APIs | `storage` (local), `commands` (shortcuts), `runtime` messaging, `action`, options page |
| AI | **Google Gemini API** — Generative Language REST, `generateContent` endpoint |
| Networking | **Fetch API** |
| UI | **HTML5 + CSS3** (in-page panel + settings page) |
| Planned (Phase 2+) | React + Vite panel, Flock support, Claude / OpenAI providers |

Everything is plain files — load the folder and it runs. No `npm install`.

---

## Install (load unpacked)

1. Open `chrome://extensions` in Chrome.
2. Turn on **Developer mode** (top-right).
3. Click **Load unpacked** and select this `replyo` folder.
4. Replyo appears in your toolbar.

## Set it up

1. Get a free Gemini API key at **https://aistudio.google.com/app/apikey** (no card needed).
2. Click the Replyo toolbar icon to open **Settings**.
3. Paste your API key, keep the default model (or set a current free-tier model), and Save.

## Use it

1. Open **https://web.whatsapp.com** and sign in.
2. Select the client's message you want to answer.
3. Press **Alt+R** (or click the green **Replyo** button, bottom-right).
4. Type your points, click **Generate**.
5. Use **Shorter / Warmer / Firmer** to tweak, then **Insert** — review and send.

## Change the keyboard shortcuts

Shortcuts are fully reconfigurable. In Settings, click **Change keyboard shortcuts**
(or open `chrome://extensions/shortcuts`). Defaults:

| Action | Default |
| --- | --- |
| Open Replyo on the selected message | `Alt+R` |
| Generate the reply | `Alt+G` |
| Insert the draft | `Alt+I` |

---

## Security notes

- Your API key lives only in `chrome.storage.local`, in your own browser.
- The key is read and used **only in the background service worker**. The content
  script that touches the WhatsApp page never sees it.
- Permissions are minimal: `storage`, plus access to WhatsApp Web and the Gemini API only.
- `chrome.storage` is protected from other extensions and sites, but is not encrypted
  on disk — normal device hygiene (lock your machine) applies.

## Known fragile points

WhatsApp Web's HTML is undocumented and changes. If Replyo stops reading the message
or inserting the reply, update the two selectors at the top of `src/content.js`
(`CONFIG.messageInput` and `CONFIG.messageBubbles`). Nothing else should need changing.

## Documentation

System design, security notes and the phase-by-phase plan are in [`docs/`](docs/README.md).

## Contributing and security

- Want to help? Read [CONTRIBUTING.md](CONTRIBUTING.md).
- Found a vulnerability? Report it privately — see [SECURITY.md](SECURITY.md).
- Release notes: [CHANGELOG.md](CHANGELOG.md).

## File structure

```
replyo/
├─ manifest.json
├─ README.md
├─ CLAUDE.md              # context for your AI coding assistant in VS Code
├─ CONTRIBUTING.md  SECURITY.md  CHANGELOG.md  LICENSE
├─ docs/                  # system design + phase plans
├─ .github/               # issue + pull request templates
├─ .claude/               # Claude Code settings, hooks, slash commands
├─ icons/                 # toolbar icons
└─ src/
   ├─ defaults.js         # one source of truth for settings defaults
   ├─ background.js       # holds the key, calls Gemini, relays commands
   ├─ content.js          # WhatsApp panel + read selection + insert reply
   ├─ panel/panel.css     # in-page panel styles
   └─ options/            # settings page (html/js/css)
```

## Roadmap

- **Phase 2** — quick-intents, surrounding-message context grab, provider switch (Claude / OpenAI).
- **Phase 3** — Flock web support, optional voice-learning from your edits.

## License

[MIT](LICENSE)
