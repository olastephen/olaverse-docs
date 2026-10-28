---
title: Model catalog
description: Every model behind the Olaverse API, and the free endpoints for discovery and health.
---

All Olaverse models are open-weight and published on [Hugging Face](https://huggingface.co/olaverse), with model cards covering training data, benchmarks and limitations.

## Decisions

`POST /v1/decide` · [Decisions](/api/decisions/)

| Model | Size | Notes |
| --- | --- | --- |
| [`purplemist-flash-1.0`](https://huggingface.co/olaverse/PurpleMIST-Flash-1.0) (default) | 7.9B | Highest accuracy; English and eight African languages. Up to 65,536 tokens of state. |
| [`purplemist-mini-1.0`](https://huggingface.co/olaverse/PurpleMIST-Mini-1.0) | 1.9B | English input at lower cost. Up to 8,192 tokens of state. |

## Document extraction

`POST /v1/extract` · [Document extraction](/api/extraction/)

| Model | Size | Notes |
| --- | --- | --- |
| [`mist-extract-1.0`](https://huggingface.co/olaverse/MIST-Extract-1.0) (default) | 4B | Most accurate. |
| [`mist-extract-flash-1.0`](https://huggingface.co/olaverse/MIST-Extract-Flash-1.0) | 2B | Faster. |

## Language identification

`POST /v1/language-id` · [Language identification](/api/language-id/)

| Model | Notes |
| --- | --- |
| [`lid-neural-608`](https://huggingface.co/olaverse/lid-neural-608) (default) | Most accurate, across 608 languages. |
| [`lid-lite-608`](https://huggingface.co/olaverse/lid-lite-608) | fastText; the fastest. |

## Diacritic restoration

`POST /v1/diacritize` · [Diacritic restoration](/api/diacritics/)

| Model | Notes |
| --- | --- |
| `diacnet-2.0` (default) | Best accuracy, and meaning hints for ambiguous words. |
| `diacnet-mini-2.0` | Nearly the same accuracy at half the size. |
| `diactag-2.0` | Cheapest and fastest. Never changes a letter and detects the language itself. |

## Question generation

`POST /v1/questions/generate` · [Question generation](/api/questions/)

| Model | Size | Notes |
| --- | --- | --- |
| [`mist-qg-1.5b`](https://huggingface.co/olaverse/mist-qg-1.5b) | 1.5B | 25 languages; questions always in the passage's own language. |

## Utility endpoints

| Endpoint | Key | What it does |
| --- | --- | --- |
| `GET /v1/models` | no | Lists every model with its endpoint, status (available / coming soon), billing unit, price and languages. |
| `GET /health` | no | `{"status": "ok", ...}` |

```bash
curl "$OLAVERSE_URL/v1/models"
```
