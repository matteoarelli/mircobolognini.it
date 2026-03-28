# Design Spec: mircobolognini.it — Sito Web Architetto

## Panoramica

Sito web professionale per **Mirco Bolognini**, architetto ad Ancona. Vetrina elegante per acquisire nuovi clienti. Single-page homepage con pagine servizio dedicate, pannello admin mobile-first, backend FastAPI su Hetzner.

**Vincolo primario:** deve essere esteticamente MOLTO diverso da paolopincini.it (stesso sviluppatore, stesso stack).

## Informazioni professionista

- **Nome:** Mirco Bolognini
- **Professione:** Architetto
- **Indirizzo:** Via Ascoli Piceno, 99, 60126 Ancona AN
- **Telefono:** 339 255 6785
- **Email:** da aggiungere via admin
- **Social:** da aggiungere via admin
- **P.IVA:** da aggiungere via admin
- **Orari:** Lun-Ven 09-13 / 15-19, Sab 10-12:30, Dom chiuso

## Servizi

1. **Progettazione Architettonica** — progettazione residenziale e commerciale a 360°
2. **Ristrutturazioni** — rinnovo e ammodernamento di spazi esistenti
3. **Interior Design** — progettazione di interni, scelta materiali e arredi
4. **Pratiche Edilizie** — gestione documentazione, permessi, pratiche comunali
5. **Certificazioni Energetiche** — APE e certificazioni di efficienza energetica
6. **Assistenza Fornitori e Artigiani** — coordinamento e selezione maestranze locali

## Design System

### Palette

| Token | Colore | Uso |
|-------|--------|-----|
| `--bg-primary` | `#1A1A1A` | Sfondo principale |
| `--bg-secondary` | `#2C2C2C` | Cards, superfici elevate |
| `--bg-tertiary` | `#333333` | Hover, bordi attivi |
| `--text-primary` | `#F5F0E8` | Testo principale (crema) |
| `--text-secondary` | `#A09888` | Testo secondario |
| `--text-muted` | `#666666` | Testo terziario |
| `--accent` | `#C9A96E` | Oro — accent principale |
| `--accent-dark` | `#8B7355` | Oro scuro — hover, variazioni |
| `--accent-light` | `#D4B87A` | Oro chiaro — highlight |
| `--whatsapp` | `#25D366` | Bottone WhatsApp |

### Tipografia

- **Heading:** Playfair Display (Google Fonts) — weights 400, 500, 600, 700
- **Body:** DM Sans (Google Fonts) — weights 300, 400, 500, 600
- **Differenza da paolopincini.it:** quello usa Space Grotesk + Inter

### Animazioni

Tutte via Framer Motion. Devono essere diverse da paolopincini.it:

| Elemento | paolopincini.it | mircobolognini.it |
|----------|----------------|-------------------|
| Hero | Clip-path reveal kinetic typography | Split screen che si apre come una porta |
| Scroll | Fade-in + parallax griglia | Scale-on-scroll + reveal con mask orizzontale |
| Servizi | Accordion verticale | Lista che si espande con slide-down |
| Loader | Overlay "PP" | Progress bar dorata orizzontale (sottile, in alto) |
| Hover | Quadrati concentrici | Bordo dorato + leggero glow |

## Struttura Homepage

### 1. Navbar
- Sfondo trasparente, diventa `--bg-primary` con blur allo scroll
- Logo: "MB" monogramma in `--accent` + "Mirco Bolognini" in `--text-primary`
- Link: Servizi, Chi Sono, Testimonianze, Contatti
- CTA button "Contattami" con bordo dorato
- Mobile: hamburger menu con fullscreen overlay scuro

### 2. Hero — Split Screen
- **Sinistra (50%):** sfondo `--bg-primary`
  - Sottotitolo: "Studio di Architettura" in `--accent`, letterspacing 3px, uppercase, DM Sans
  - Nome: "Mirco Bolognini" in Playfair Display, grande (clamp 2.5-4rem)
  - Tagline: una frase breve, es. "Trasformo visioni in spazi che ispirano"
  - Linea dorata separatrice (40px × 2px)
  - CTA: "Scopri i servizi" bottone con bordo dorato
- **Destra (50%):** foto architettura full-bleed da Pexels API
- **Animazione:** le due metà partono unite al centro e si aprono verso i lati (durata 1.2s, ease-out)
- **Mobile:** stack verticale, immagine sopra (40vh), testo sotto

### 3. Servizi — Lista Numerata Elegante
- Titolo sezione: "Servizi" in Playfair Display + linea dorata
- 6 righe, ognuna con:
  - Numero (01-06) in `--accent`, Playfair Display
  - Nome servizio in `--text-primary`, letterspacing 1px
  - Freccia → in `--accent` (a destra)
  - Separatore: linea 1px `--bg-tertiary`
- **Hover/tap:** riga si espande con slide-down mostrando:
  - Descrizione breve (2 righe) in `--text-secondary`
  - Piccola immagine a destra (opzionale, da Pexels)
  - Link "Approfondisci →" alla pagina dedicata
- **Animazione scroll:** righe appaiono una alla volta con stagger di 100ms
- **Clic:** porta a `/servizi/[slug]`

### 4. Chi Sono
- Layout asimmetrico: testo a sinistra (60%), foto a destra (40%)
- La foto NON usa diamond clip-path (quello è di paolopincini.it)
- Foto con bordo sottile `--accent` e leggero offset/shadow
- Testo: bio professionale, formazione, approccio
- Stats opzionali: anni di esperienza, progetti completati (gestibili da admin)
- **Animazione:** reveal con mask orizzontale da sinistra, foto scale-in da 0.8 a 1

### 5. Testimonianze — Una Grande alla Volta
- Virgolette dorate oversize (", font 120px, `--accent`, opacity 0.3) come elemento decorativo
- Una recensione alla volta, centrata:
  - Testo in Playfair Display italic, font-size clamp(1.1rem, 2vw, 1.4rem)
  - Nome autore sotto, DM Sans, `--text-secondary`
- **Cambio automatico:** ogni 6 secondi con crossfade (opacity transition 0.8s)
- **Indicatori:** dots piccoli sotto, dot attivo in `--accent`
- **Dati:** 13 recensioni reali da Google (inserite nel seed, gestibili da admin)

### 6. Contatti — Full-Width Statement
- Grande frase: "Hai un progetto in mente?" in Playfair Display, clamp(2rem, 4vw, 3.5rem)
- Sottotesto: "Contattami per una consulenza senza impegno" in `--text-secondary`
- 3 bottoni CTA allineati orizzontalmente:
  - **Chiama** — icona telefono, `tel:+393392556785`
  - **WhatsApp** — icona WA, colore `--whatsapp`, link `wa.me/393392556785`
  - **Email** — icona mail, `mailto:` (placeholder finché non impostata da admin)
- Sotto i bottoni: indirizzo + orari in piccolo, `--text-muted`
- **Animazione:** testo appare con fade-up, bottoni con stagger

### 7. Footer
- Sfondo `#111111` (più scuro del body)
- Colonne: Info studio | Link rapidi | Contatti
- P.IVA / C.F. in fondo (quando disponibili, gestibili da admin)
- Link social predisposti (icone grigie, si attivano quando configurati da admin)
- Copyright: "© 2026 Mirco Bolognini Architetto"

## Pagine Servizio (`/servizi/[slug]`)

- Hero piccolo con titolo servizio + sottotitolo
- Contenuto: descrizione lunga, lista punti chiave, immagine
- Schema.org `Service` per SEO
- CTA in fondo: "Interessato a questo servizio? Contattami"
- Breadcrumb: Home > Servizi > [Nome Servizio]
- Navigazione: link al servizio precedente/successivo

## Pagina 404

- Sfondo `--bg-primary`
- "404" grande in Playfair Display, `--accent`, semi-trasparente
- "Pagina non trovata" + "La pagina che cerchi non esiste o è stata spostata"
- Bottone "Torna alla homepage" con bordo dorato

## Favicon

- Generata dinamicamente via `icon.tsx`
- Monogramma "MB" in `--accent` su sfondo `--bg-primary`
- Playfair Display bold

## Pannello Admin (`/admin`)

### Principi
- **Mobile-first** — l'utente lo usa principalmente dal telefono
- Design scuro coerente col sito ma con UI più funzionale
- Sidebar collassabile su mobile (hamburger)

### Autenticazione
- Login page: username + password
- JWT access token (30min) + refresh token (7 giorni)
- Credenziali default: `admin` / password generata sicura

### Sezioni
1. **Dashboard** — conteggio contatti non letti, statistiche rapide
2. **Testi** — modifica hero (tagline, sottotitolo), bio Chi Sono, CTA contatti
3. **Servizi** — CRUD completo, riordino drag-and-drop, slug auto-generato
4. **Testimonianze** — CRUD, toggle visibilità per singola testimonianza
5. **Portfolio** — CRUD progetti con immagini, toggle globale on/off (default: off)
6. **Contatti** — lista click CTA con timestamp, canale (tel/wa/email), stato letto/non letto
7. **Impostazioni** — email, social, P.IVA, orari, toggle portfolio

## Backend (FastAPI)

### Modelli

```
User: id, username, password_hash, created_at
SiteContent: id, section (hero/about/cta), key, value, updated_at
Service: id, title, slug, short_description, long_description, icon, image_url, sort_order, is_active, created_at, updated_at
Testimonial: id, author_name, author_role, quote, rating, is_visible, sort_order, created_at
PortfolioProject: id, title, slug, description, images (JSON), is_active, sort_order, created_at, updated_at
Contact: id, channel (phone/whatsapp/email), ip_address, user_agent, is_read, created_at
Setting: id, key, value, updated_at
```

### API Endpoints

**Pubblici (`/api/`):**
- `GET /api/content` — tutti i contenuti per sezione
- `GET /api/services` — servizi attivi ordinati
- `GET /api/services/{slug}` — singolo servizio
- `GET /api/testimonials` — testimonianze visibili
- `GET /api/portfolio` — progetti portfolio (solo se abilitato globalmente)
- `GET /api/settings/public` — settings pubblici (social, orari)

**Auth (`/api/auth/`):**
- `POST /api/auth/login` — ritorna access + refresh token
- `POST /api/auth/refresh` — rinnova access token

**Admin (`/api/admin/`)** — tutti protetti con JWT:
- CRUD per ogni entità (services, testimonials, portfolio, content, settings)
- `PUT /api/admin/services/reorder` — riordino servizi
- `GET /api/admin/contacts` — lista contatti con filtro letto/non letto
- `PUT /api/admin/contacts/{id}/read` — segna come letto
- `GET /api/admin/dashboard` — conteggi per dashboard

### Seed Script
Popola il database con:
- Utente admin con password sicura
- 6 servizi con descrizioni
- 13 testimonianze reali da Google
- Contenuti hero, about, CTA di default
- Settings iniziali (portfolio_enabled: false)

## Stack Tecnologico

| Componente | Tecnologia |
|-----------|-----------|
| Frontend | Next.js 15+ (App Router), React, TypeScript |
| Styling | Tailwind CSS 4 (`@theme` blocks) |
| Animazioni | Framer Motion |
| Font | Playfair Display + DM Sans (Google Fonts) |
| Immagini | Pexels API (hotlinked) |
| Backend | FastAPI, SQLAlchemy, PyMySQL |
| Auth | python-jose (JWT), passlib + bcrypt 4.0.1 |
| Database | MariaDB (container esistente su Hetzner) |
| Deploy FE | Vercel (`npx vercel --prod --yes`) |
| Deploy BE | Docker su Hetzner (docker-compose esistente) |
| Proxy API | Next.js API route `/api/proxy/[...path]` |

## Infrastruttura

### Frontend (Vercel)
- `BACKEND_URL` come env var server-side (non NEXT_PUBLIC)
- ISR con `revalidate: 60` per dati dinamici
- Fallback a dati statici se backend non raggiungibile

### Backend (Hetzner)
- Directory: `/opt/services/mircobolognini/`
- Container: `mircobolognini-api` nel docker-compose principale
- Reti: `web` + `internal`
- Database: `mircobolognini` su MariaDB esistente
- Reverse proxy: Caddy, porta dedicata (es. `:8444`)
- `.env`: `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGINS`

### API Proxy (HTTPS → HTTP)
- Route Next.js: `/api/proxy/[...path]/route.ts`
- Il frontend chiama `/api/proxy/...` (stesso dominio, HTTPS)
- Il proxy inoltra a `BACKEND_URL` (HTTP su Hetzner)
- Gestisce GET, POST, PUT, DELETE, PATCH

## Differenze chiave da paolopincini.it

| Elemento | paolopincini.it | mircobolognini.it |
|----------|----------------|-------------------|
| Palette | Bianco + Nero + Rosso | Nero + Crema + Oro/Bronzo |
| Font | Space Grotesk + Inter | Playfair Display + DM Sans |
| Hero | Kinetic typography, clip-path | Split screen, apertura a porta |
| Servizi | Accordion numerato | Lista espandibile con hover |
| Testimonianze | Carousel orizzontale | Singola grande con crossfade |
| CTA | Sfondo scuro + 3 bottoni | Full-width statement serif oversize |
| About | Diamond clip-path + stats | Asimmetrico con mask reveal |
| Loader | Overlay "PP" | Progress bar dorata sottile |
| Elemento decorativo | Quadrati concentrici "PP" | Linee dorate sottili, monogramma MB |
| Cursor | Custom cursor follower | Nessun custom cursor |
