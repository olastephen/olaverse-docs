---
title: Models and utility endpoints
description: The models behind each endpoint, and the free endpoints for discovery and health.
---

## Models

| Endpoint | Models | Default |
| --- | --- | --- |
| `/v1/decide` | `purplemist-flash-1.0`, `purplemist-mini-1.0` | `purplemist-flash-1.0` |
| `/v1/extract` | `mist-extract-1.0`, `mist-extract-flash-1.0` | `mist-extract-1.0` |
| `/v1/language-id` | `lid-neural-608`, `lid-lite-608` | `lid-neural-608` |
| `/v1/diacritize` | `diacnet-2.0`, `diacnet-mini-2.0`, `diactag-2.0` | `diacnet-2.0` |
| `/v1/questions/generate` | `mist-qg-1.5b` | `mist-qg-1.5b` |

All of them are open-weight and published on [Hugging Face](https://huggingface.co/olaverse), with model cards covering training data, benchmarks and limitations.

## Utility endpoints

| Endpoint | Key | What it does |
| --- | --- | --- |
| `GET /v1/models` | no | Lists every model with its endpoint, status (available / coming soon), billing unit and languages. |
| `GET /health` | no | `{"status": "ok", ...}` |
| `POST /v1/warmup` | yes | Starts services in the background. See [Cold starts and warm-up](/get-started/warm-up/). |

```bash
curl "$OLAVERSE_URL/v1/models"
```
