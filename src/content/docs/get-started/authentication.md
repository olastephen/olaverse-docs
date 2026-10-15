---
title: Authentication
description: Send your API key as a bearer token.
---

Every `POST` request needs your API key as a bearer token. `GET` endpoints such as `/v1/models` and `/health` are open.

```http
Authorization: Bearer YOUR_API_KEY
```

## Getting a key

Create keys in the [developer console](https://console.olaverselab.com) under **API keys**. You can give each key a name and an expiry date, and revoke it at any time. A key is shown only once, when you create it.

## Keeping keys safe

- Call the API from your server, never from a browser or mobile app, where the key could be read.
- Use a separate key per environment (for example `production` and `staging`), so you can revoke one without touching the other.
- If a key leaks, revoke it in the console straight away and create a new one.

A missing or wrong key returns `401`. See [Errors](/reference/errors/).
