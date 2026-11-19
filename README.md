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

## Struktur

- `public/index.html` – Startseite (Spanisch)
- `public/img/` – Hero-Fallback-Foto, Favicon
- `public/js/hero-video.js` – Hero-Hintergrundvideo (YouTube, Ausschnitt 00:27–00:49, abgedunkelt; ab 768px, sonst Foto)
- `public/fonts/` – Fraunces + Inter, selbst gehostet (SIL OFL, keine Google-Fonts-Anfrage → DSGVO)
- `public/js/contact-form.js` – Kontaktformular

Geplante Unterseiten (auf der Startseite schon verlinkt): `/mosquiteras/`, `/tipos-de-tejido/`,
`/sobre-nosotros/`, sowie `/aviso-legal/`, `/privacidad/`, `/cookies/`.

## Kontaktformular → Zoho

Das Formular ist für Zoho CRM (Web-to-Lead) bzw. Zoho Forms vorbereitet. In
`public/js/contact-form.js` oben `ZOHO_CONFIG` ausfüllen:

1. `endpoint` – die `action`-URL aus dem Zoho-Snippet
2. `hiddenFields` – alle Hidden-Felder aus dem Snippet (z. B. `xnQsjsdp`, `xmIwtLD`, `actionType`)
3. `fieldMap` – lokale Feldnamen → Zoho-Feldnamen

Ohne `endpoint` öffnet das Formular eine vorausgefüllte E-Mail an info@netec-mosquiteras.com.
