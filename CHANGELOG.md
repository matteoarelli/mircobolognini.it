# Changelog

## 2026-03-28 — Lancio iniziale

### Backend (FastAPI)
- Setup completo: config, database, models, auth JWT, schemas Pydantic
- API pubblica: content, services, testimonials, portfolio, contact tracking
- API admin: CRUD completo per tutte le entità, settings, dashboard
- Seed con 6 servizi, 13 testimonianze Google reali, contenuti sito
- Deploy Docker su Hetzner (porta 8444 via Caddy)
- Webhook auto-deploy configurato

### Frontend (Next.js 15+)
- Homepage single-page: hero, servizi, chi sono, testimonianze, contatti, footer
- Hero full-bleed con immagine Pexels, parallax, grid pattern architettonico
- Servizi: lista numerata espandibile con sub-servizi tag, glow hover
- Chi Sono: layout asimmetrico con stats credibilità (anni, progetti, rating)
- Testimonianze: crossfade automatica con stelle, cerchi decorativi
- Contatti: CTA full-width con cornice dorata, tracking click
- 6 pagine servizio dedicate con SEO, Schema.org, navigazione prev/next
- Pannello admin mobile-first con CRUD completo
- Pagina 404 personalizzata, favicon dinamica "MB"
- API proxy per HTTPS→HTTP (Vercel→Hetzner)
- Deploy su Vercel (mircobolognini-it)

### Design
- Tema scuro elegante (#1A1A1A) + accenti oro (#C9A96E)
- Playfair Display + DM Sans
- Grain/noise texture overlay per profondità
- Framer Motion: parallax hero, scroll reveal, crossfade, accordion
- Custom cursor dorato (desktop), shimmer placeholder immagini
- 10 round di refinement estetico (5 base + 5 intensivi)
