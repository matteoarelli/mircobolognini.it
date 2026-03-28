# mircobolognini.it

Sito web professionale per Mirco Bolognini, architetto ad Ancona.

## Stack
- **Frontend:** Next.js 15+ (App Router), Tailwind CSS 4, Framer Motion — deploy su Vercel
- **Backend:** FastAPI, SQLAlchemy, PyMySQL — Docker su Hetzner (porta 8444)
- **Database:** MariaDB (`mircobolognini`) sul container esistente

## URL
- Frontend: https://mircobolognini-it.vercel.app/
- Backend API: http://204.168.153.43:8444
- Admin: /admin/login (credenziali: admin / MircoBolognini2026!)

## Struttura
```
frontend/         # Next.js app
  src/app/        # Pages (App Router)
  src/components/ # Componenti React
  src/lib/        # API client, dati statici
  src/types/      # TypeScript interfaces
backend/          # FastAPI app
  app/            # Moduli Python (models, routers, auth, seed)
```

## Deploy
- **Backend:** auto-deploy via webhook su push a master (hook `mircobolognini` su Hetzner)
- **Frontend:** `cd frontend && npx vercel --prod --yes`

## Design
- Tema scuro (#1A1A1A) + oro (#C9A96E) + crema (#F5F0E8)
- Font: Playfair Display (heading) + DM Sans (body)
- DEVE essere visivamente diverso da paolopincini.it

## Convenzioni
- Commenti codice in italiano
- Backend: snake_case — Frontend: camelCase (mappatura in page.tsx e lib/data.ts)
- ISR con revalidate: 60s per dati dinamici
- API proxy Next.js `/api/proxy/[...path]` per HTTPS→HTTP
- passlib+bcrypt 4.0.1 per password hashing