---
title: Billing and usage
description: What each endpoint is billed per, and how to read the usage block.
---

Every billable response has a `usage` block in that endpoint's unit.

| Endpoint | Billed per | `usage` example |
| --- | --- | --- |
| `/v1/decide` (and `/v1/systemone`) | decision (question) | `{"decisions": 3}` |
| `/v1/extract` | document | `{"documents": 1}` |
| `/v1/language-id` | text | `{"texts": 1}` |
| `/v1/diacritize` | 1,000 characters | `{"characters": 23, "billable_units": 1}` |
| `/v1/questions/generate` | passage | `{"generations": 1}` |
| `GET /v1/models`, `/v1/languages`, `/health` | free | |

## What isn't billed

- **Failed batch items.** In a batch, each item succeeds or fails on its own, and only successful items are billed: answered questions for decisions, extracted documents for extraction.
- **Unparseable extractions.** When an extraction comes back with `"data": null` because the model's answer wasn't valid JSON, the call is not billed.

## Tracking usage

The [developer console](https://console.olaverselab.com) shows your requests over time, broken down by endpoint, along with your plan and payment history.
