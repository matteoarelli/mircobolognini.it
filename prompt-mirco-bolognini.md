# Progetto: Sito Web per Mirco Bolognini — Architetto

## Contesto

Devi creare un sito web professionale moderno e bellissimo per **Mirco Bolognini**, architetto. Il sito deve essere una vetrina per la sua professionalità e portargli nuovi contatti/clienti. Deve essere stile 2026, innovativo per il settore architettura.

**IMPORTANTE:** Ho già realizzato un sito simile per un geometra (paolopincini.it). Questo sito DEVE essere esteticamente MOLTO diverso — palette, layout, animazioni, stile tipografico — tutto deve differire significativamente. Non devono sembrare fatti dallo stesso template.

## Informazioni sul professionista

- **Nome:** Mirco Bolognini
- **Professione:** Architetto
- **[COMPLETARE: indirizzo, telefono, email, P.IVA, C.F.]**
- **[COMPLETARE: servizi principali offerti]**
- **[COMPLETARE: zona operativa]**
- **[COMPLETARE: anni di esperienza, specializzazioni]**

## Requisiti funzionali

### Frontend (Next.js 15+ su Vercel)
- **Homepage single-page** con sezioni scrollabili:
  1. **Hero section** — d'impatto, con animazioni
  2. **Servizi** — presentazione dei servizi offerti
  3. **Chi Sono / Studio** — bio professionale
  4. **Portfolio/Progetti** — galleria lavori (se ha materiale fotografico, altrimenti predisporre per il futuro)
  5. **Testimonianze** — carousel recensioni clienti
  6. **Contatti/CTA** — bottoni azione diretta (Chiama, WhatsApp, Email) senza form
- **Pagine servizio** dedicate (`/servizi/[slug]`) con SEO e Schema.org
- **Pagina portfolio** (attivabile/disattivabile dall'admin)
- **404 personalizzata** brandizzata
- **Favicon dinamica** con monogramma

### Pannello Admin (integrato in Next.js sotto `/admin`)
- **Mobile-first** — l'utente lo usa principalmente dal telefono
- **Login** con username/password
- **Dashboard** con contatti non letti
- **Gestione testi** — modifica hero, bio, CTA
- **Gestione servizi** — CRUD completo con riordino
- **Gestione testimonianze** — CRUD con toggle visibilità
- **Gestione portfolio** — CRUD progetti con toggle globale visibilità
- **Contatti ricevuti** — lista click CTA (chiama/whatsapp/email) con stato letto/non letto

### Backend (FastAPI + MySQL su Hetzner)
- API REST completa per tutti i contenuti del sito
- Autenticazione JWT (access + refresh token)
- Seed script per dati iniziali
- Dockerfile per deploy containerizzato

## Stack tecnologico

| Componente | Tecnologia |
|-----------|-----------|
| Frontend | Next.js 15+ (App Router), React, Tailwind CSS 4, Framer Motion |
| Backend | FastAPI, SQLAlchemy, PyMySQL, python-jose, passlib |
| Database | MySQL/MariaDB |
| Deploy frontend | Vercel (temporaneo, poi Hetzner) |
| Deploy backend | Hetzner (Docker container) |

## Infrastruttura Hetzner

Il backend va deployato sul server Hetzner esistente. Accesso SSH:

```bash
ssh -i "C:/Users/Matteo/Desktop/Progetti/Hetzner Server/hetzner_production" -o StrictHostKeyChecking=no root@204.168.153.43 '<comando>'
```

### Setup sul server
- **Docker Compose principale:** `/opt/services/docker-compose.yml`
- **MariaDB esistente:** container `mariadb`, rete `internal`, password root in `/opt/services/.env` (variabile `MYSQL_ROOT_PASSWORD`)
- **Reverse proxy:** Caddy (`/opt/services/caddy/Caddyfile`)
- **NON creare un container MySQL separato** — usa il MariaDB esistente sulla rete `internal`
- **Crea una nuova porta Caddy** (es. `:8444`) per il reverse proxy dell'API, oppure usa un sottodominio se disponibile

### Deploy checklist
1. Creare directory `/opt/services/mircobolognini/` con app Python
2. Creare `.env` con `DATABASE_URL=mysql+pymysql://root:<password>@mariadb:3306/mircobolognini` e `JWT_SECRET`
3. Creare database: `docker exec mariadb mysql -uroot -p<password> -e "CREATE DATABASE IF NOT EXISTS mircobolognini CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"`
4. Aggiungere servizio `mircobolognini-api` al docker-compose principale (reti: `web`, `internal`, depends_on: `mariadb`)
5. Aggiungere porta in Caddy e nei ports del container caddy nel docker-compose
6. Build, start, seed
7. **Problema HTTPS/Mixed Content:** Il frontend Vercel è HTTPS ma il backend è HTTP. Soluzione: creare un API route proxy in Next.js (`/api/proxy/[...path]/route.ts`) che fa da ponte. Il frontend chiama il proxy (stesso dominio, HTTPS), il proxy chiama il backend (HTTP). Impostare `BACKEND_URL` come env var server-side su Vercel.

### Passlib + bcrypt fix
Nel `requirements.txt` pinnare `bcrypt==4.0.1` per evitare incompatibilità con passlib:
```
passlib[bcrypt]==1.7.4
bcrypt==4.0.1
```

## Vincoli di design — DEVE ESSERE DIVERSO da paolopincini.it

Il sito paolopincini.it ha queste caratteristiche. Il nuovo sito DEVE differire su tutti questi punti:

| Elemento | paolopincini.it | Mirco Bolognini (DEVE ESSERE DIVERSO) |
|----------|----------------|---------------------------------------|
| Palette | Bianco #FAFAFA + Nero #1A1A1A + Rosso #C62828 | **Proponi palette diversa** — es. nero/crema/oro, oppure bianco/verde scuro/bronzo, oppure sfondo scuro con accent caldo |
| Hero | Kinetic typography "Progetto. Misuro. Realizzo." con clip-path reveal | **Approccio diverso** — es. hero con immagine full-bleed, o split screen, o video background, o morphing text |
| Elemento grafico | Quadrati concentrici rotanti "PP" stile blueprint | **Elemento diverso** — essendo architetto, potrebbe avere piante architettoniche animate, linee prospettiche, o composizione asimmetrica |
| Servizi | Accordion numerato verticale | **Layout diverso** — es. grid di card, bento grid, horizontal scroll, o tab con pannelli |
| Testimonianze | Carousel con slide orizzontale | **Formato diverso** — es. layout masonry, o cards statiche in griglia, o una singola grande con cambio morbido |
| CTA Contatti | Sfondo scuro con 3 bottoni | **Trattamento diverso** — es. split screen con mappa, o form minimo + bottoni, o layout asimmetrico |
| Tipografia | Space Grotesk (heading) + Inter (body) | **Font diversi** — es. Playfair Display + DM Sans, o Syne + Space Mono, o Outfit + Source Serif |
| Animazioni | Clip-path reveal, scroll fade-in, parallax griglia | **Animazioni diverse** — es. horizontal scroll sections, scale-on-scroll, reveal con mask, cursor-aware elements |
| Page loader | Overlay scuro con "PP" che scorre via | **Loader diverso** — es. progress bar, o counter 0-100%, o wipe orizzontale, o nessun loader |
| Sezione About | Testo + immagine diamond clip-path + stats | **Layout diverso** — es. timeline, o full-width image + testo sovrapposto, o scroll-triggered reveal |

## Siti di ispirazione (settore architettura)

Cerca ispirazione da siti premiati su Awwwards nel settore architettura. Ecco alcuni da cui partire:

- **https://minaleandmann.com/** — pulizia estrema, servizi con dropdown
- **https://www.studiodado.com/** — spazio bianco, ritmo, "less is more"
- **https://www.powerhouse-company.com/** — palette ristretta, microinterazioni
- **https://apt.london/** — branding nella tipografia, forme dinamiche
- **https://telhaclarke.com.au/** — bianco e nero, parallax
- **https://www.composites.archi/** — storytelling via scroll, illustrazioni
- **https://formafantasma.com/** — ultra-minimalismo italiano
- **https://www.helloelva.com/** — kinetic typography
- **https://www.perkinseastman.com/** — titoli oversize, accent arancione

Ma NON copiare lo stile di paolopincini.it che è già ispirato ad alcuni di questi.

## Immagini

Usa la **Pexels API** per immagini di architettura di alta qualità:
- API key: `i13ZCVKhoDG9CblR3FWzJfSjLaKFLIB7YWbxeHnWjT8kzM6WwI3NUe96`
- Endpoint: `https://api.pexels.com/v1/search?query=QUERY&per_page=5`
- Header: `Authorization: i13ZCVKhoDG9CblR3FWzJfSjLaKFLIB7YWbxeHnWjT8kzM6WwI3NUe96`
- Usa le URL `src.large` o `src.large2x` dai risultati (hot-linkable)

Cerca: "modern architecture", "architectural design interior", "minimalist building", "architectural model", "construction design"

## Processo di lavoro

### Fase 1: Brainstorming e Design
1. Proponi 3 direzioni estetiche DIVERSE (palette, stile, mood) — mostra mockup se possibile
2. Chiedi conferma all'utente sulla direzione scelta
3. Definisci la struttura completa del sito
4. Scrivi una design spec in `docs/superpowers/specs/`

### Fase 2: Implementazione
1. **Setup progetto** — Next.js 15+, Tailwind CSS 4, Framer Motion
2. **Componenti frontend** — tutti i componenti della homepage
3. **Pagine servizio** — dettaglio con SEO e Schema.org
4. **Backend FastAPI** — modelli, auth, CRUD, seed
5. **Admin panel** — tutte le sezioni CRUD, mobile-first
6. **API proxy** — route Next.js per bypassare Mixed Content HTTPS→HTTP
7. **Deploy Vercel** — frontend con `npx vercel --prod --yes`
8. **Deploy Hetzner** — backend Docker + Caddy

### Fase 3: Raffinamento estetico
Fai **almeno 5 round** di revisione estetica e funzionale. Ad ogni round:
1. Analizza il sito con occhio critico
2. Confronta con i siti di ispirazione
3. Migliora tipografia, spacing, animazioni, microinterazioni
4. Verifica responsive (mobile, tablet, desktop)
5. Ribuildi e redeploya

**NON presentare il sito finché non è a livello WOW.** Il risultato deve far dire "incredibile" a chi lo apre.

### Fase 4: Verifica end-to-end
- Testa il login admin
- Modifica un dato dall'admin e verifica che appaia sul frontend (entro 60s con ISR)
- Verifica tutti i bottoni CTA (chiama, whatsapp, email)
- Verifica tutte le pagine servizio
- Verifica la 404
- Verifica mobile

## Note tecniche importanti

### Next.js 15+ API changes
- `params` nelle page components è una `Promise` — va awaited: `const { slug } = await params`
- `generateMetadata({ params })` riceve anche params come Promise
- Tailwind CSS 4 usa `@theme` blocks in `globals.css` per custom values (non `tailwind.config.ts`)

### Struttura frontend consigliata
```
frontend/src/
├── app/
│   ├── layout.tsx          # Root layout, fonts, metadata, Schema.org
│   ├── page.tsx            # Homepage (async, fetcha dal backend con fallback statico)
│   ├── not-found.tsx       # 404 personalizzata
│   ├── icon.tsx            # Favicon dinamica
│   ├── globals.css         # Tailwind + @theme + animazioni custom
│   ├── api/proxy/[...path]/route.ts  # Proxy API per HTTPS→HTTP
│   ├── servizi/[slug]/page.tsx       # Pagine servizio
│   └── admin/                        # Pannello admin
├── components/             # Tutti i componenti UI
├── lib/
│   ├── api.ts              # Client API (usa /api/proxy/ come base URL)
│   └── data.ts             # Dati statici di fallback
└── types/index.ts          # TypeScript types
```

### Frontend → Backend connection
- I componenti accettano dati come props con fallback a dati statici
- `page.tsx` è un Server Component async che fetcha dal backend
- Usa `{ next: { revalidate: 60 } }` per ISR
- Il client API (`lib/api.ts`) usa `/api/proxy` come base URL (non l'URL diretto del backend)
- Impostare `BACKEND_URL` come env var server-side su Vercel (non NEXT_PUBLIC)
- Il backend restituisce campi in snake_case — mappare a camelCase nel frontend

### Credenziali admin di default
- Username: `admin`
- Password: `[SCEGLI UNA PASSWORD SICURA]`

## Output atteso

Alla fine del lavoro devo avere:
1. **URL Vercel** del sito funzionante
2. **Backend operativo** su Hetzner con API accessibile
3. **Admin panel funzionante** con login
4. **Modifiche dall'admin** che si riflettono sul sito entro 60 secondi
5. Un sito che fa dire **WOW** — esteticamente al livello dei migliori studi di architettura
