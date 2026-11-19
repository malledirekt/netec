# Netec

Statische Website mit Tailwind CSS, gehostet als Cloudflare Worker (Static Assets).

## Lokal

```sh
npm install
npm run dev      # Tailwind im Watch-Modus
npm run preview  # Build + lokaler Worker (wrangler dev)
```

## Deploy (Cloudflare Workers Builds)

- Build-Befehl: `npm run build`
- Deploy-Befehl: `npx wrangler deploy`
- Root: `/`

`public/` wird ausgeliefert. `public/styles.css` wird beim Build erzeugt und ist nicht im Repo.
