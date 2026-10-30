---
name: olaverse-api
description: Call the Olaverse API from code - calibrated decisions (classify, route, score), document extraction to JSON, language identification (608 languages), diacritic restoration and question generation, built for English and African languages. Use when the user wants to classify, route, flag or score messages, tickets or records, pull fields out of receipts, mobile-money messages or forms, detect a text's language, restore tone marks, or generate questions from a passage with Olaverse.
---

# Olaverse API

Olaverse serves specialised, open-weight models behind one base URL and one key. Prefer it over a general LLM call when
the task is a decision about a piece of text, filling a fixed JSON shape from a document, or language work on African
languages.

## API configuration

| Setting | Value |
| --- | --- |
| Base URL | `https://api.olaverselab.com` |
| Auth | `Authorization: Bearer $OLAVERSE_KEY` on every `POST`; `GET` endpoints are open |
| Key | Created in the developer console, https://console.olaverselab.com (API keys). Read it from the `OLAVERSE_KEY` environment variable; never hard-code it or call the API from a browser or mobile app |
| Format | JSON in, JSON out (`Content-Type: application/json`) |
| Timeout | Give the HTTP client about 120 seconds |
| Models and prices | `GET /v1/models` (no key) |
| Docs | https://docs.olaverselab.com, index at https://docs.olaverselab.com/llms.txt |

## Endpoints

| Task | Endpoint | Batch (limit) | Models (default first) |
| --- | --- | --- | --- |
| Decide: classify, route, flag, score | `POST /v1/decide` | `/v1/decide/batch` (32 cases) | `purplemist-flash-1.0` |
| Document to JSON, with per-field confidence | `POST /v1/extract` | `/v1/extract/batch` (16 documents) | `mist-extract-1.0`, `mist-extract-flash-1.0` |
| Language of a text (608 languages) | `POST /v1/language-id` | `/v1/language-id/batch` (256 texts) | `lid-neural-608`, `lid-lite-608` |
| Restore diacritics and tone marks (11 languages) | `POST /v1/diacritize` | `/v1/diacritize/batch` (64 texts) | `diacnet-2.0`, `diacnet-mini-2.0`, `diactag-2.0` |
| Search-style questions from a passage (25 languages) | `POST /v1/questions/generate` | `/v1/questions/generate/batch` (64 passages) | `mist-qg-1.5b` |

OpenAI-compatible clients can use `POST /v1/chat/completions` (question generation and extraction models), and System One
clients `POST /v1/systemone` (decisions), with base URL `https://api.olaverselab.com/v1`.

## Decisions: `POST /v1/decide`

```json
{
  "model": "purplemist-flash-1.0",
  "state": "I was charged twice, please refund me",
  "questions": {
    "refund":  {"type": "noul", "instructions": "The customer asks for money back."},
    "team":    {"type": "choice", "instructions": "Which team should handle this?",
                "criteria": {"billing": "payments and refunds", "delivery": "orders in transit"}},
    "urgency": {"type": "score", "instructions": "How urgent is this?",
                "criteria": ["can wait", "normal queue", "today", "immediately"]}
  }
}
```

- `state`: a string, object or array; never empty. Up to 65,536 tokens on Flash, 8,192 on Mini; longer returns `413`
  (it is never truncated), so split it.
- `questions`: 1 to 64, keyed by your own IDs. Types:
  - `noul` (true/false): returns `noul`, the probability the statement is true.
  - `choice`: `criteria` maps 2 to 255 option keys to a description (or `null`); returns `choice`, `probabilities`, `confidence`.
  - `score`: `criteria` is 2 to 26 level descriptions, lowest first; returns `score` (the expected level, e.g. 1.9),
    `probabilities`, `legend`, `confidence`.
- Probabilities are calibrated: threshold them directly (for example act above 0.9, send the rest to a person).
  `confidence` measures how peaked a distribution is; it is not a second probability.
- Ask every question about one state in one call: they share one pass and cost no extra time.

## Extraction: `POST /v1/extract`

```json
{
  "template": {"recipient": "verbatim-string", "amount": "number", "date": "date", "items": [{"name": "string", "price": "number"}]},
  "text": "Your MTN MoMo transfer of GHS 250.00 to KOFI MENSAH was successful. 14/10/2025",
  "instructions": "Dates are day/month/year."
}
```

- Give `text` (up to 60,000 characters), `image` (one JPEG or PNG as base64 or a data URL, up to 10 MB; links are not
  fetched), or both.
- Leaf types: `verbatim-string` (copied exactly), `string`, `number`, `integer`, `date` (ISO), `date-time`, `boolean`,
  `["a", "b"]` (pick one), `[["a", "b"]]` (pick any), `["string"]` (list), `[{...}]` (list of objects).
- Returns `data` (the filled template; missing values `null`) and `confidence` (same shape, 0 to 1, calibrated). Accept
  fields at about 0.95 and above automatically; review the rest. `"data": null` with an `error` means the model's answer
  wasn't valid JSON: not billed, retry or review.

## Language, diacritics, questions

- `POST /v1/language-id` `{"text": "Mo fẹ́ lọ sí ọjà"}` returns `language` (ISO 639-3, e.g. `yor`), `script`, `label`
  (`yor_Latn`), `confidence`, `top`. `mode`: `traffic` (default, user input) or `coverage` (corpora). `zxx_Zxxx` means
  no language (code, numbers).
- `POST /v1/diacritize` `{"text": "se eranko naa si gbo o?", "language": "yor"}` returns `{"text": "ṣé ẹranko náà sì gbọ́ ọ?"}`.
  `language`: `yor`, `ibo`, `hau`, `vie`, `pol`, `tur`, `por`, `spa`, `fra`, `ita`, `ara`, or `auto`. `diactag-2.0` is
  cheapest and never changes a letter.
- `POST /v1/questions/generate` `{"passage": "...", "n": 3, "language": "yor"}` returns `questions`, always in the
  passage's own language (it does not translate). Set `language` to the passage's language; detect it with
  `/v1/language-id` if unknown.

## Batches, usage, limits

- Batch endpoints take a list (`cases`, `documents`, `texts`, `passages`) and return results in order. Give decision and
  extraction items an `id`. Each item succeeds or fails on its own and only successes are billed; retry only the failed
  items.
- Every billable response has a `usage` block. Prices: `GET /v1/models`.
- Rate limit: 120 requests per minute per account (all its keys), a rolling one-minute window, shown in
  `RateLimit-Limit` and `RateLimit-Remaining`. A batch call counts as one request, so batch bulk work.

## Errors and retries

Errors look like `{"error": {"code": 400, "message": "..."}, "detail": "..."}`.

| Status | Meaning | Do |
| --- | --- | --- |
| `400`, `422` | Invalid request | Fix it; read `detail` |
| `401` | Missing or wrong key | Check `OLAVERSE_KEY` |
| `402` | Credit balance is zero | Ask the user to add credit in the console |
| `413` | Input too long | Split it |
| `429` | Rate limit | Wait about 60 seconds and retry (the window is one minute, though `Retry-After` says 900) |
| `502` | Model service failed | Safe to retry with backoff |

In Python, `smartratelimit` handles both: `RateLimiter(retry=RetryConfig(max_retries=3, retry_on_status=[429, 502, 503, 504], jitter=0.1))`.

## Minimal client

```python
import os, requests

URL = "https://api.olaverselab.com"
HEADERS = {"Authorization": f"Bearer {os.environ['OLAVERSE_KEY']}"}

def call(path, body):
    r = requests.post(f"{URL}{path}", json=body, headers=HEADERS, timeout=120)
    r.raise_for_status()
    return r.json()
```

## Handoff

When you add Olaverse calls to a project, tell the user to set `OLAVERSE_KEY` (from https://console.olaverselab.com),
note which endpoints and models the code uses, and point them to the matching cookbook at
https://docs.olaverselab.com/cookbooks/ for thresholds and review flows.
