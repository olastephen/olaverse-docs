---
title: Errors
description: Status codes the API returns and what to do about each.
---

Errors come back in the shape OpenAI, OpenRouter and LiteLLM clients read, with the same message in `detail`:

```json
{"error": {"code": 400, "message": "unknown model 'jev-1.14'; see GET /v1/models"},
 "detail": "unknown model 'jev-1.14'; see GET /v1/models"}
```

A `429` comes from the gateway's rate limiter before the request reaches a model, so its body is different: `{"success": false, "message": "Rate limit exceeded"}`, with a `Retry-After` header. Check the status code rather than the body.

The status codes:

| Status | Meaning | What to do |
| --- | --- | --- |
| `400` | The request is invalid: an empty field, an unknown model or language, or hints that don't match texts. | Fix the request; `detail` says what's wrong. |
| `401` | The API key is missing or wrong. | Check the `Authorization` header. |
| `402` | Your credit balance has reached zero. | [Add credit](/reference/billing/#adding-credit) in the developer console. |
| `413` | A decision request is too long for the model (it is never truncated), a document is too long for the model's memory, or the body is over its size limit. | Split the input. |
| `422` | The body has the wrong types or out-of-range values. | `message` names the first field; `detail` lists them all. |
| `429` | Too many requests: you've used up your rate limit. | Wait and retry. See [Retries and timeouts](/troubleshooting/retries/#rate-limits). |
| `502` | The model service failed. | Safe to retry. See [Retries and timeouts](/troubleshooting/retries/). |
