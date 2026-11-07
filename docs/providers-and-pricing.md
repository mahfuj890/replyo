# AI providers and pricing

For a short message in and a short reply out, cost is tiny on any provider and zero on
Gemini's free tier — which is where development should start.

A typical reply is roughly **1,500 input tokens** (style prompt + client message + your
points) and **~300 output tokens**.

## Cost comparison

Approximate, per 1M tokens (input / output), as of November 2026.

| Provider | Low-cost model | Price per 1M (in / out) | Free tier | Approx. cost per reply |
| --- | --- | --- | --- | --- |
| Google Gemini | Flash / Flash-Lite | Free tier; paid Flash-Lite ≈ $0.25 / $1.50 | Yes (via AI Studio) | $0 on free tier |
| Anthropic Claude | Haiku 4.5 | ≈ $1 / $5 | No | ≈ $0.003 |
| OpenAI | Budget GPT tier | ≈ $0.20 / $1.20 | No standing free tier | < $0.001 |

> **Prices change often.** Treat the table as a ballpark and confirm on the official pages:
> [Anthropic](https://www.anthropic.com/pricing) ·
> [Google Gemini](https://ai.google.dev/gemini-api/docs/pricing) ·
> [OpenAI](https://openai.com/api/pricing).

Notes:

- A consumer chat subscription and the developer API are billed separately. A
  subscription does not include API credits, so using Claude or OpenAI here means adding
  a few dollars of API credit.
- Only Google offers a standing free API tier; the others are paid from the first call,
  though the amounts are pennies.

## Free-first development

Build and test on Gemini's free Flash tier — no card, no cost. Because the engine is
provider-agnostic, switching to Claude or OpenAI later is a settings change.

## Provider switch

`handleGenerate()` in `src/background.js` branches on `settings.provider`. To add a
provider, add a `callClaude` / `callOpenAI` function and a branch. Nothing else changes.

| Provider | Request |
| --- | --- |
| Gemini | `POST .../v1beta/models/{model}:generateContent`, header `x-goog-api-key`, body `{ contents: [{ parts: [{ text }] }] }`; read `candidates[0].content.parts[].text` |
| Claude | `POST https://api.anthropic.com/v1/messages`, headers `x-api-key`, `anthropic-version`, and from a browser/extension `anthropic-dangerous-direct-browser-access: true` |
| OpenAI | `POST https://api.openai.com/v1/chat/completions`, header `Authorization: Bearer` |

Adding a provider also means adding **only that provider's API host** to
`host_permissions` in `manifest.json`.
