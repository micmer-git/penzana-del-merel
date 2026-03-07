# La Penzana del Merel — Sito Web Ufficiale

Sito web bilingual (IT/EN) per **La Penzana del Merel**, pizzeria di famiglia ad Orezzo (BG), Valle Seriana.

- **Live:** https://micmer-git.github.io/penzana-del-merel/
- **Repo:** https://github.com/micmer-git/penzana-del-merel
- **Stack:** Astro 4 · Static · GitHub Pages

---

## Struttura

```
src/
  data/
    menu.js        # Dati menù (prezzi, categorie) — EDITARE QUI
    site.js        # Config sito (WhatsApp, contatti) — EDITARE QUI
  layouts/
    BaseLayout.astro   # Template HTML base (SEO, meta, font)
  components/
    Header.astro       # Navigazione + toggle lingua
    Footer.astro       # Footer con link
  pages/             # Pagine italiane (radice)
    index.astro        # Home IT
    storia.astro       # Storia IT
    famiglia.astro     # Famiglia IT
    territorio.astro   # Territorio IT
    menu.astro         # Menù + Ordine QR (IT)
    galleria.astro     # Galleria IT
    contatti.astro     # Contatti IT
    qr-sheet.astro     # Foglio QR stampabile
    en/              # Pagine inglesi
      index.astro, history.astro, family.astro,
      area.astro, menu.astro, gallery.astro, contact.astro
  styles/
    global.css         # Design system completo
scripts/
  generate-qr.mjs     # Generatore QR (esegue automaticamente prima del build)
public/
  qr/               # 20 QR code SVG (table-01.svg … table-20.svg)
  favicon.svg
  robots.txt
  sitemap.xml
.github/workflows/
  deploy.yml          # GitHub Actions → GitHub Pages
```

---

## Configurazione obbligatoria

### 1. Numero WhatsApp per gli ordini dal tavolo

Aprire **due** file e sostituire `TODO_INSERT_WHATSAPP_NUMBER`:

```
src/data/site.js        → WHATSAPP_NUMBER = '39XXXXXXXXXX'
src/pages/menu.astro    → const WHATSAPP_NUMBER = '39XXXXXXXXXX'
src/pages/en/menu.astro → const WHATSAPP_NUMBER = '39XXXXXXXXXX'
```

Formato: `39` + numero senza spazi né `+`. Es. `393351234567`.

### 2. Orari di apertura

Aprire `src/pages/contatti.astro` e `src/pages/en/contact.astro`, cercare `TODO` e inserire gli orari.

### 3. Foto galleria

Mettere le foto JPG/WebP in `public/gallery/` e aggiornare `src/pages/galleria.astro` e `src/pages/en/gallery.astro`.

---

## Sviluppo locale

```bash
npm install
npm run dev       # Server locale: http://localhost:4321/penzana-del-merel/
```

## Build e deploy

Il deploy avviene automaticamente tramite GitHub Actions ad ogni push su `main`.

```bash
git add -A && git commit -m "update" && git push
```

Il workflow `.github/workflows/deploy.yml` esegue:
1. `node scripts/generate-qr.mjs` (prebuild — genera QR codes)
2. `astro build` → genera `/dist`
3. Upload + deploy su GitHub Pages

---

## QR code per i tavoli

- **20 QR code** generati in `public/qr/` (table-01.svg … table-20.svg)
- Ogni QR apre: `https://micmer-git.github.io/penzana-del-merel/menu/?table=table-XX`
- **Foglio stampabile:** https://micmer-git.github.io/penzana-del-merel/qr-sheet/
  - Aprire nel browser e premere Ctrl+P / Cmd+P per stampare

### Rigenerare i QR

```bash
node scripts/generate-qr.mjs
```

---

## TODO aperti

- [ ] **WhatsApp number** — impostare in `src/data/site.js` e nelle due pagine menu
- [ ] **Orari di apertura** — inserire in contatti IT + EN
- [ ] **Foto galleria** — aggiungere foto reali in `public/gallery/`
- [ ] **Email** — aggiungere se disponibile in `src/data/site.js`
- [ ] **Instagram** — aggiungere se disponibile in `src/data/site.js`
- [ ] **Prenotazioni** — confermare metodo (telefono/online) in contatti
- [ ] **Descrizioni pizza** — completare i toppings marcati TODO in `src/data/menu.js`
- [ ] **Foto OG** — creare immagine 1200x630 in `public/og/default.jpg`
- [ ] **Trasporti pubblici** — verificare linee SAB da Bergamo
- [ ] **Parcheggio** — aggiungere indicazioni parcheggio locale

---

## Fonti

Vedi `sources.md`.
