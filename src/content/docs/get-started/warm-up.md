---
title: Cold starts and warm-up
description: Services start on demand. Warm them ahead of traffic so the first call is fast.
---

Each service starts on demand and shuts down after **5 idle minutes**. The next request waits while it starts again.

Two habits avoid surprises:

1. **Use a generous timeout.** Give your HTTP client a timeout of about 2 minutes.
2. **Warm up ahead of time.** When your app gets a moment of warning (a user opens a screen, starts a session, is about to upload a document), start the services you're about to use:

```python
call("/v1/warmup", {"services": ["decide", "language-id"]})
```

```bash
curl -X POST "$OLAVERSE_URL/v1/warmup" \
  -H "Authorization: Bearer $OLAVERSE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"services": ["extract"]}'
```

`/v1/warmup` returns straight away and starts the services in the background. It accepts any of:

| Service | Warms |
| --- | --- |
| `decide` | Decisions |
| `extract` | Document extraction |
| `language-id` | Language identification |
| `diacritize` | Diacritic restoration (`diacnet` models) |
| `diactag` | Diacritic restoration (`diactag-2.0`) |
| `questions` | Question generation |

