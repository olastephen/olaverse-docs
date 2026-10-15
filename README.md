# Olaverse Lab Docs

Public documentation for the Olaverse API, built with [Starlight](https://starlight.astro.build) (Astro). Intended for `docs.olaverselab.com`.

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static site in dist/, with a Pagefind search index
```

## Where things live

| Path | What |
| --- | --- |
| `src/content/docs/` | Every page, as Markdown or MDX. The file path is the URL. |
| `astro.config.mjs` | Site title, sidebar order, social links. |
| `src/styles/olaverse.css` | Brand colours and fonts on top of Starlight's theme. |

To add a page, create a `.md` or `.mdx` file under `src/content/docs/` and add it to the `sidebar` in `astro.config.mjs`.

## Conventions

- Examples use `https://api.olaverselab.com` and a key from the developer console, never the Modal backend URL, so all traffic goes through the gateway that authenticates and bills it.
- Figures and limits come from the API's v3 reference. Keep them in step with `Olaverse-console/src/lib/catalog.ts`, which drives the console's docs and playground.

## Deploying

The build output is static. On Vercel, import the repo with the Astro preset (build `npm run build`, output `dist`) and add the `docs.olaverselab.com` domain.
