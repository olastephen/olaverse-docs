---
title: Pricing
description: Per-token prices for every model, and how tokens are counted.
---

Pricing is pay as you go. You add credit to your account, and each call is deducted from it at the per-token price of the model you use. There are no subscriptions, minimums or monthly fees.

## Pay as you go

Prices are in US dollars, per million tokens.

| Model | Endpoint | Input / 1M tokens | Output / 1M tokens |
| --- | --- | --- | --- |
| `purplemist-flash-1.0` | `/v1/decide` | $0.60 | no output charge |
| `purplemist-mini-1.0` | `/v1/decide` | $0.15 | no output charge |
| `mist-extract-1.0` | `/v1/extract` | $0.80 | $4.00 |
| `mist-extract-flash-1.0` | `/v1/extract` | $0.40 | $2.00 |
| `lid-neural-608` | `/v1/language-id` | $0.02 | no output charge |
| `lid-lite-608` | `/v1/language-id` | $0.005 | no output charge |
| `diacnet-2.0` | `/v1/diacritize` | $0.10 | $0.10 |
| `diacnet-mini-2.0` | `/v1/diacritize` | $0.06 | $0.06 |
| `diactag-2.0` | `/v1/diacritize` | $0.02 | no output charge |
| `mist-qg-1.5b` | `/v1/questions/generate` | $0.10 | $0.40 |

`GET /v1/models` and `/health` are free.

## How tokens are counted

- **Input tokens** are everything you send the model: the state and questions, the template and document (images included), the text or the passage.
- **Output tokens** are what the model writes, such as extracted JSON, restored text or generated questions.
- **Decision, language-ID and diactag models** score or tag rather than generate text, so they only have an input charge.
- **Asking more decision questions** about the same state adds only the questions' own tokens, because they share one pass over the state.

## What isn't charged

- **Failed batch items.** In a batch, each item succeeds or fails on its own, and only successful items are charged.
- **Unparseable extractions.** When an extraction comes back with `"data": null` because the model's answer wasn't valid JSON, the call is not charged.

## Adding credit

Add credit from **Billing** in the [developer console](https://console.olaverselab.com), where you can also see your balance, your requests over time and your top-up history. When your balance runs out, calls are refused until you add more.

## Olaverse Enterprise

Private deployment for enterprise environments.

| | |
| --- | --- |
| Deployment | Private cloud or on-prem |
| Confidentiality | By design: your data never leaves your environment |
| Fine-tuning | Optional, on your own data |
| Pricing | Tiered usage |

[Talk to us](https://www.olaverselab.com/contact) about an Enterprise deployment.
