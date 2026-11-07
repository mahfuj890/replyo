# Replyo documentation

Design and planning docs for Replyo. For install and usage, see the
[project README](../README.md).

## System design

| Doc | What it covers |
| --- | --- |
| [Architecture](architecture.md) | The end-to-end flow, the three contexts, and the stack |
| [Features and settings](features-and-settings.md) | Core features, the settings page, keyboard shortcuts |
| [AI providers and pricing](providers-and-pricing.md) | Supported providers, rough cost per reply, how to switch |
| [Security](security.md) | How the API key is protected, permissions, known limits |

## Build phases

Replyo is built in phases so something useful works early and the fragile parts are
added only once the core proves itself.

| Phase | Theme | Status |
| --- | --- | --- |
| [Phase 1](phases/phase-1.md) | Core: WhatsApp Web + Gemini, select → generate → insert | Done |
| [Phase 2](phases/phase-2.md) | Polish: quick-intents, context grab, provider switch | Planned |
| [Phase 3](phases/phase-3.md) | Reach: Flock support, voice learning | Planned |

## For AI coding assistants

[`CLAUDE.md`](../CLAUDE.md) at the repo root holds the hard rules and boundaries. It
links back here for the full design.
