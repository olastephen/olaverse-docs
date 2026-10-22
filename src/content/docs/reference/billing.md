---
title: Pricing
description: Pay-as-you-go prices for every model, and how each one is charged.
---

Pricing is pay as you go. You add credit to your account, and each call is deducted from it at the price of the model you use. There are no subscriptions or monthly fees.

**Every new account starts with $5 of free credit**, so you can try every endpoint before adding any.

## Prices

Prices are in US dollars. Each model is charged in the unit that fits what it does: tokens for models that read and write text, requests for language identification, characters for diacritics, and documents for MIST-Extract-1.0.

| Model | Endpoint | Price |
| --- | --- | --- |
| `purplemist-flash-1.0` | `/v1/decide` | $0.12 per 1M input tokens, output free |
| `purplemist-mini-1.0` | `/v1/decide` | $0.025 per 1M input tokens, output free |
| `mist-extract-1.0` | `/v1/extract` | $1.00 per 1,000 documents |
| `mist-extract-flash-1.0` | `/v1/extract` | $0.04 per 1M input tokens, output free |
| `mist-qg-1.5b` | `/v1/questions/generate` | $0.04 per 1M input tokens, $0.12 per 1M output tokens |
| `lid-neural-608` | `/v1/language-id` | $0.10 per 1,000 requests |
| `lid-lite-608` | `/v1/language-id` | $0.02 per 1,000 requests |
| `diacnet-2.0` | `/v1/diacritize` | $1.00 per 1M characters |
| `diacnet-mini-2.0` | `/v1/diacritize` | $0.60 per 1M characters |
| `diactag-2.0` | `/v1/diacritize` | $0.20 per 1M characters |

For scale: a typical decision of about 1,900 tokens on `purplemist-flash-1.0` costs about $0.23 per 1,000 decisions.

`GET /v1/models` and `/health` are free. Models that are also listed on OpenRouter cost the same here.

## How each call is charged

- **Tokens.** Input tokens are everything you send the model: the state and questions, the template and document (images included), or the passage. Output tokens are what it writes. Decisions and MIST-Extract-Flash charge input only. Asking more decision questions about the same state adds only the questions' own tokens, because they share one pass over the state.
- **Requests.** Each language-ID request covers one text of up to 1,000 characters. In a batch, each text counts as one request.
- **Characters.** Diacritics are charged on the characters of text you send.
- **Documents.** MIST-Extract-1.0 is charged per document extracted, whatever its length.
- **Minimum per request.** Each request costs at least one unit, or 500 tokens on token-priced models.

Every response carries a `usage` block with the tokens, texts, characters or documents it was charged on.

## What isn't charged

- **Failed batch items.** In a batch, each item succeeds or fails on its own, and only successful items are charged.
- **Unparseable extractions.** When an extraction comes back with `"data": null` because the model's answer wasn't valid JSON, it isn't charged.

## Adding credit

Add credit from **Billing** in the [developer console](https://console.olaverselab.com), where you can also see your balance, your requests over time and your top-up history.

| Credit pack | You get |
| --- | --- |
| $10 | $10 of credit |
| $50 | $50 of credit |
| $200 | $220 of credit (10% extra) |

We email you when your balance runs low. When it reaches zero, calls return `402` until you add more.

## Olaverse Enterprise

Private deployment for enterprise environments.

| | |
| --- | --- |
| Deployment | Private cloud or on-prem |
| Confidentiality | By design: your data never leaves your environment |
| Fine-tuning | Optional, on your own data |
| Pricing | Tiered usage |

[Talk to us](https://www.olaverselab.com/contact) about an Enterprise deployment.
