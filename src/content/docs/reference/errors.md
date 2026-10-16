---
title: Errors
description: Status codes the API returns and what to do about each.
---

Errors come back in the shape OpenAI, OpenRouter and LiteLLM clients read, with the same message in `detail`:

```json
{"error": {"code": 400, "message": "unknown model 'jev-1.14'; see GET /v1/models"},
 "detail": "unknown model 'jev-1.14'; see GET /v1/models"}
```

The status codes:

| Status | Meaning | What to do |
| --- | --- | --- |
| `400` | The request is invalid: an empty field, an unknown model or language, or hints that don't match texts. | Fix the request; `detail` says what's wrong. |
| `401` | The API key is missing or wrong. | Check the `Authorization` header. |
| `413` | A decision request is too long for the model (it is never truncated), a document is too long for the GPU's memory, or the body is over its size limit. | Split the input. |
| `422` | The body has the wrong types or out-of-range values. | `message` names the first field; `detail` lists them all. |
| `502` | The model service failed. | Safe to retry. |

## Cold starts

Each service shuts down after 5 idle minutes, and the next request waits while it starts. That's a slow response, not an error, so give your HTTP client a timeout of about 2 minutes and use [`/v1/warmup`](/get-started/warm-up/) ahead of time.

## Retrying

`502` is safe to retry. A simple pattern is up to three attempts with a growing pause:

```python
import time, requests

def call_with_retry(path, body, attempts=3):
    for i in range(attempts):
        r = requests.post(f"{URL}{path}", json=body, headers=HEADERS, timeout=120)
        if r.status_code != 502 or i == attempts - 1:
            r.raise_for_status()
            return r.json()
        time.sleep(2 ** i)
```
