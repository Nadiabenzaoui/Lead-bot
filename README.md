# Lead Bot

Bot de prospection B2B fullstack.

## Stack
- **Frontend**: React + Tailwind + Recharts + Socket.io-client
- **Backend**: Node.js + Express + Prisma + PostgreSQL + Bull Queue + WebSocket
- **Bot**: Playwright + Hunter.io + Brevo SMTP + Twilio + OpenAI

## Démarrage rapide

### 1. Infrastructure
```bash
docker-compose up -d
```

### 2. Backend
```bash
cd backend
cp .env.example .env
# Remplir les clés API dans .env
npm install
npx playwright install chromium
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

### 3. Frontend
```bash
cd frontend
npm install
npm start
```

## URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Health check: http://localhost:3001/health

## Routes API

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | /leads/search | Lancer scraping |
| GET | /leads | Lister les leads |
| PUT | /leads/:id | Modifier statut |
| DELETE | /leads/:id | Supprimer lead |
| POST | /score | Scorer un lead |
| POST | /send | Envoyer message |
| GET | /monitor | Stats temps réel |
| POST | /bot/start | Démarrer le bot |
| POST | /bot/stop | Stopper le bot |
| GET | /export?format=csv|json|pdf | Exporter |

## Services
1. **LeadScraper** — Scrape LinkedIn avec Playwright
2. **LeadEnricher** — Trouve emails via Hunter.io
3. **LeadScorer** — Score 0-10 (chaud/tiède/froid)
4. **LeadDeduplicator** — Déduplique les leads
5. **EmailService** — Cold emails via Brevo SMTP
6. **LinkedInService** — Messages LinkedIn directs
7. **WhatsAppService** — Twilio WhatsApp
8. **SMSService** — Twilio SMS
9. **AIProfiler** — Messages personnalisés GPT-4o-mini
10. **TemplateEngine** — Templates avec variables
11. **FollowUpService** — Relances J+3, J+7
12. **ExportService** — Export CSV/JSON/PDF
