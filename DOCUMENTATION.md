# Lead Bot — Documentation complète

## Table des matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Architecture](#2-architecture)
3. [Structure des dossiers](#3-structure-des-dossiers)
4. [Base de données](#4-base-de-données)
5. [Les services](#5-les-services)
6. [Le bot et la queue](#6-le-bot-et-la-queue)
7. [Les routes API](#7-les-routes-api)
8. [Le frontend](#8-le-frontend)
9. [Comment lancer le projet](#9-comment-lancer-le-projet)
10. [Variables d'environnement](#10-variables-denvironnement)
11. [Flux complet d'une prospection](#11-flux-complet-dune-prospection)

---

## 1. Vue d'ensemble

Lead Bot est un outil de **prospection B2B automatisée**. Il permet de :

- Trouver automatiquement des prospects sur LinkedIn
- Enrichir leurs profils avec leurs emails professionnels
- Les scorer selon leur potentiel commercial
- Leur envoyer des messages personnalisés (email, LinkedIn, WhatsApp, SMS)
- Gérer les relances automatiques
- Suivre les résultats en temps réel depuis un dashboard

### Schéma simplifié

```
LinkedIn
   ↓
[Scraper] → [Enrichisseur] → [Scoreur] → [Déduplicateur]
                                                ↓
                                         [Base de données]
                                                ↓
                              [Email / LinkedIn / WhatsApp / SMS]
                                                ↓
                                         [Dashboard web]
```

---

## 2. Architecture

### Stack technique

| Couche | Technologie | Rôle |
|--------|-------------|------|
| Frontend | React 18 + Tailwind + Recharts | Dashboard et interface utilisateur |
| Temps réel | Socket.io | Logs et stats en direct |
| Backend | Node.js + Express | API REST |
| ORM | Prisma | Accès base de données |
| Base de données | PostgreSQL | Stockage des leads et messages |
| Queue | Bull + Redis | Tâches asynchrones et retry automatique |
| Scraping | Playwright (Chromium) | Navigation automatisée sur LinkedIn |
| Emails | Nodemailer + Brevo SMTP | Envoi de cold emails |
| SMS / WhatsApp | Twilio | Envoi de messages mobiles |
| IA | OpenAI GPT-4o-mini | Génération de messages personnalisés |
| Emails pro | Hunter.io API | Recherche d'emails professionnels |

### Pourquoi cette architecture ?

**Bull Queue + Redis** : le scraping LinkedIn peut prendre plusieurs minutes. Sans queue, l'API se bloquerait. Bull exécute ces tâches en arrière-plan, les relance en cas d'échec, et plusieurs jobs peuvent tourner en parallèle.

**WebSocket (Socket.io)** : au lieu de faire des appels API toutes les secondes, le backend pousse les événements au frontend en temps réel. Chaque étape du bot (scrape, enrich, score...) envoie un message instantané au dashboard.

**Prisma** : évite d'écrire du SQL brut. Le schéma est défini une fois, Prisma génère les types TypeScript et les requêtes.

---

## 3. Structure des dossiers

```
lead-bot/
│
├── docker-compose.yml        ← Lance PostgreSQL + Redis en local
├── README.md
├── DOCUMENTATION.md
│
├── backend/
│   ├── server.js             ← Point d'entrée, monte tout
│   ├── package.json
│   ├── .env.example          ← Template des variables d'environnement
│   │
│   ├── prisma/
│   │   ├── schema.prisma     ← Définition des tables
│   │   └── seed.js           ← 20 leads de test
│   │
│   ├── routes/
│   │   ├── leads.js          ← CRUD leads + lancement recherche
│   │   ├── score.js          ← Scorer un lead
│   │   ├── send.js           ← Envoyer un message
│   │   ├── monitor.js        ← Statistiques globales
│   │   ├── bot.js            ← Contrôle du bot (start/stop/status)
│   │   └── export.js         ← Export CSV / JSON / PDF
│   │
│   ├── services/
│   │   ├── LeadScraper.js        ← Playwright → LinkedIn
│   │   ├── LeadEnricher.js       ← Hunter.io API
│   │   ├── LeadScorer.js         ← Algorithme de scoring
│   │   ├── LeadDeduplicator.js   ← Détection doublons
│   │   ├── EmailService.js       ← Brevo SMTP
│   │   ├── LinkedInService.js    ← Messages LinkedIn (Playwright)
│   │   ├── WhatsAppService.js    ← Twilio WhatsApp
│   │   ├── SMSService.js         ← Twilio SMS
│   │   ├── AIProfiler.js         ← OpenAI GPT-4o-mini
│   │   ├── TemplateEngine.js     ← Templates avec variables
│   │   ├── FollowUpService.js    ← Relances J+3 et J+7
│   │   └── ExportService.js      ← CSV / JSON / PDF
│   │
│   ├── bot/
│   │   └── queue.js          ← Orchestrateur Bull Queue
│   │
│   └── websocket/
│       └── index.js          ← Initialisation Socket.io
│
└── frontend/
    ├── package.json
    ├── tailwind.config.js
    └── src/
        ├── App.js             ← Router + navigation
        ├── index.js           ← Point d'entrée React
        ├── index.css          ← Tailwind imports
        ├── utils/
        │   └── api.js         ← Instance Axios configurée
        └── pages/
            ├── LeadsPage.js   ← Tableau des leads
            ├── MonitorPage.js ← Stats et graphiques
            ├── BotPage.js     ← Contrôle du bot + logs live
            └── SendPage.js    ← Envoi manuel de messages
```

---

## 4. Base de données

### Table `leads`

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Identifiant unique |
| `nom` | String | Nom complet du prospect |
| `email` | String? | Email professionnel |
| `secteur` | String? | Secteur d'activité |
| `score` | Float | Score 0 à 10 |
| `categorie` | Enum | CHAUD / TIEDE / FROID |
| `statut` | Enum | NOUVEAU / CONTACTE / EN_COURS / CONVERTI / PERDU / BLACKLIST |
| `source` | String? | D'où vient ce lead (LinkedIn, import...) |
| `titre` | String? | Poste occupé (CEO, CTO...) |
| `entreprise` | String? | Nom de l'entreprise |
| `linkedinUrl` | String? | URL du profil LinkedIn |
| `telephone` | String? | Numéro pour SMS/WhatsApp |
| `taille` | String? | Taille de l'entreprise |
| `createdAt` | DateTime | Date de création |

### Table `messages`

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Identifiant unique |
| `leadId` | UUID | Référence vers le lead |
| `canal` | Enum | EMAIL / LINKEDIN / WHATSAPP / SMS |
| `statut` | Enum | ENVOYE / ECHEC / EN_ATTENTE |
| `opened` | Boolean | Email ouvert ? |
| `clicked` | Boolean | Lien cliqué ? |
| `replied` | Boolean | Réponse reçue ? |
| `content` | String? | Contenu ou objet du message |
| `sentAt` | DateTime | Date d'envoi |

### Table `bot_jobs`

Trace l'historique des lancements du bot (date début, fin, config utilisée).

---

## 5. Les services

### LeadScraper
Lance un navigateur Chromium invisible, se connecte à LinkedIn avec ton cookie de session, et scrape les résultats de recherche. Pour chaque profil : nom, titre, entreprise, URL LinkedIn.

> Limite : LinkedIn peut détecter le scraping. Utilise un compte secondaire et ne scrape pas plus de 50 leads par session.

### LeadEnricher
Appelle l'API Hunter.io en deux étapes :
1. Trouve le domaine email de l'entreprise (ex: `acme.com`)
2. Devine l'email du contact à partir du prénom + nom + domaine

### LeadScorer
Algorithme de points :

| Critère | Points |
|---------|--------|
| Email disponible | +3 |
| Secteur premium (SaaS, Fintech, IA...) | +2 |
| Titre décideur (CEO, CTO, Fondateur...) | +2 |
| Entreprise 200-500 personnes | +2 |
| Entreprise 50-200 personnes | +1 |
| Profil LinkedIn disponible | +1 |

- Score ≥ 7 → **CHAUD** (rouge)
- Score ≥ 4 → **TIEDE** (orange)
- Score < 4 → **FROID** (bleu)

### LeadDeduplicator
Avant d'insérer en base, vérifie :
- L'email n'existe pas déjà en base
- La combinaison nom + entreprise n'existe pas déjà dans le batch en cours

### EmailService
Utilise Nodemailer connecté au SMTP Brevo. Chaque envoi est tracé dans la table `messages`.

### AIProfiler
Envoie le profil du lead à GPT-4o-mini avec un prompt structuré. Le modèle génère un message court et personnalisé adapté au canal (email = 150 mots max, SMS = 50 mots max).

### TemplateEngine
Système de templates avec variables `{{prenom}}`, `{{entreprise}}`, etc. Templates disponibles :
- `cold_email` — premier contact par email
- `followup_j3` — relance 3 jours après
- `followup_j7` — relance 7 jours après
- `linkedin_connect` — message de connexion LinkedIn
- `sms` — message court SMS

### FollowUpService
Tourne régulièrement et cherche les leads contactés dont le premier email date de 3 ou 7 jours, sans réponse. Envoie automatiquement le bon template de relance.

---

## 6. Le bot et la queue

### Fonctionnement de Bull Queue

Bull est un système de file d'attente basé sur Redis. Au lieu d'exécuter le scraping directement dans la route HTTP (ce qui bloquerait), on ajoute un **job** dans la queue et on répond immédiatement à l'utilisateur.

```
Route /bot/start
      ↓
  Crée un job dans Redis
      ↓
  Répond "Bot démarré" au client
      ↓ (en arrière-plan)
  Worker traite le job :
    1. scrapeLinkedIn()
    2. enrichBatch()
    3. scoreBatch()
    4. deduplicate()
    5. prisma.lead.createMany()
    6. (optionnel) EmailService.send()
      ↓
  Chaque étape → socket.emit('bot:log', ...)
      ↓
  Fin → socket.emit('bot:done', { total: N })
```

### Retry automatique

Si une étape échoue (ex: LinkedIn rate limit), Bull relance automatiquement le job jusqu'à 3 fois avec un délai entre chaque tentative.

### Événements WebSocket émis

| Événement | Données | Déclencheur |
|-----------|---------|-------------|
| `bot:log` | `{ message, step }` | Chaque étape du pipeline |
| `bot:lead` | objet lead complet | Chaque lead sauvegardé |
| `bot:done` | `{ total }` | Fin du job |
| `bot:error` | `{ message }` | Erreur fatale |

---

## 7. Les routes API

### Leads

```
GET    /leads                    Liste les leads (filtres: categorie, statut, search, page)
POST   /leads/search             Lance le bot de scraping
PUT    /leads/:id                Modifie un lead (statut, notes...)
DELETE /leads/:id                Supprime un lead
```

### Score

```
POST   /score                    Calcule le score d'un lead
                                 Body: { leadId } ou { leadData }
```

### Envoi

```
POST   /send                     Envoie un message
                                 Body: { leadId, canal, templateKey?, customMessage?, useAI? }
```

### Monitoring

```
GET    /monitor                  Retourne les stats globales (totaux, taux ouverture/clic/réponse)
```

### Bot

```
POST   /bot/start                Démarre le bot
                                 Body: { keywords, location?, limit?, autoSend? }
POST   /bot/stop                 Stoppe le bot en cours
GET    /bot/status               État de la queue (waiting, active, completed, failed)
```

### Export

```
GET    /export?format=csv        Télécharge les leads en CSV
GET    /export?format=json       Télécharge les leads en JSON
GET    /export?format=pdf        Télécharge les leads en PDF
       + filtres: categorie, statut
```

---

## 8. Le frontend

### LeadsPage (`/`)
Tableau paginé de tous les leads avec :
- Barre de recherche (nom, email, entreprise)
- Filtres par catégorie et statut
- Score affiché en gras
- Badge catégorie coloré (rouge/orange/bleu)
- Menu déroulant pour changer le statut directement dans le tableau
- Bouton supprimer
- Lien export CSV

### MonitorPage (`/monitor`)
- 5 cartes de stats : total leads, messages envoyés, taux d'ouverture, de clic, de réponse
- Pie chart : répartition chaud / tiède / froid
- Bar chart : messages par canal
- Liste des 5 derniers leads ajoutés
- Rafraîchissement automatique toutes les 10 secondes

### BotPage (`/bot`)
- Formulaire : mots-clés, localisation, limite de leads, option auto-envoi email
- Boutons Start (vert) / Stop (rouge)
- Compteurs de la queue en temps réel
- Terminal de logs : affiche chaque étape du bot avec horodatage et code couleur (vert = lead ajouté, rouge = erreur, violet = terminé)

### SendPage (`/send`)
- Sélection du lead dans une liste déroulante
- Choix du canal (EMAIL / LINKEDIN / WHATSAPP / SMS)
- Choix d'un template ou message libre
- Option "Générer avec IA" (désactive les autres champs)
- Retour visuel succès / erreur

---

## 9. Comment lancer le projet

### Prérequis

- Node.js 18+
- Docker Desktop
- Un terminal

### Étape 1 — Cloner et configurer

```bash
cd lead-bot

# Copier le fichier de configuration
cp backend/.env.example backend/.env

# Ouvrir .env et remplir les clés API
# (voir section 10 pour le détail de chaque clé)
```

### Étape 2 — Lancer la base de données et Redis

```bash
docker-compose up -d
```

Cela démarre :
- PostgreSQL sur le port **5432**
- Redis sur le port **6379**

Vérifier que tout tourne : `docker-compose ps`

### Étape 3 — Installer et initialiser le backend

```bash
cd backend
npm install

# Télécharger le navigateur pour Playwright
npx playwright install chromium

# Créer les tables en base
npx prisma migrate dev --name init

# Insérer 20 leads de test
node prisma/seed.js

# Démarrer le serveur
npm run dev
```

Le backend tourne sur **http://localhost:3001**
Vérifier : http://localhost:3001/health → doit répondre `{ "status": "ok" }`

### Étape 4 — Lancer le frontend

Dans un **nouveau terminal** :

```bash
cd lead-bot/frontend
npm install
npm start
```

Le dashboard s'ouvre sur **http://localhost:3000**

### Résumé des ports

| Service | Port | URL |
|---------|------|-----|
| Frontend React | 3000 | http://localhost:3000 |
| Backend Express | 3001 | http://localhost:3001 |
| PostgreSQL | 5432 | — |
| Redis | 6379 | — |

### Arrêter le projet

```bash
# Stopper les serveurs Node : Ctrl+C dans chaque terminal

# Stopper Docker
docker-compose down

# Stopper Docker ET supprimer les données
docker-compose down -v
```

---

## 10. Variables d'environnement

Fichier : `backend/.env`

```env
# Base de données (correspond aux valeurs du docker-compose.yml)
DATABASE_URL="postgresql://leadbot:leadbot123@localhost:5432/leadbot"

# Redis (pour Bull Queue)
REDIS_URL="redis://localhost:6379"

# Port du serveur
PORT=3001

# Hunter.io — trouver les emails professionnels
# Récupérer sur : hunter.io → Dashboard → API
HUNTER_API_KEY=

# Brevo SMTP — envoyer les cold emails
# Récupérer sur : brevo.com → Paramètres → SMTP & API
BREVO_SMTP_HOST=smtp-relay.brevo.com
BREVO_SMTP_PORT=587
BREVO_SMTP_USER=ton@email.com
BREVO_SMTP_PASS=
FROM_EMAIL=ton@email.com
FROM_NAME=Ton Nom

# OpenAI — génération de messages personnalisés
# Récupérer sur : platform.openai.com → API keys
OPENAI_API_KEY=

# Twilio — SMS et WhatsApp
# Récupérer sur : twilio.com → Dashboard
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE=+33xxxxxxxxx
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

# LinkedIn — cookie de session pour le scraping
# Récupérer via : F12 → Application → Cookies → li_at
LINKEDIN_COOKIE=
```

---

## 11. Flux complet d'une prospection

Voici ce qui se passe quand tu cliques sur **Démarrer** dans le bot avec les mots-clés "CEO SaaS Paris" :

```
1. Frontend → POST /bot/start { keywords: "CEO SaaS Paris", limit: 20 }

2. Backend → crée un job Bull dans Redis
   → répond immédiatement { jobId: "123" }

3. Worker Bull démarre en arrière-plan :

   a. LeadScraper.scrapeLinkedIn("CEO SaaS Paris")
      → ouvre Chromium, va sur linkedin.com/search
      → extrait 20 profils : nom, titre, entreprise, URL
      → WebSocket: "20 leads scrapés"

   b. LeadEnricher.enrichBatch(leads)
      → pour chaque lead, appelle Hunter.io
      → trouve les emails disponibles
      → WebSocket: "8 emails trouvés"

   c. LeadScorer.scoreBatch(leads)
      → calcule un score 0-10 pour chacun
      → attribue chaud/tiède/froid
      → WebSocket: "Scoring terminé"

   d. LeadDeduplicator.deduplicate(leads)
      → vérifie qu'aucun n'existe déjà en base
      → WebSocket: "17 leads uniques"

   e. prisma.lead.createMany(leads)
      → sauvegarde les 17 leads en base
      → pour chacun : WebSocket "Lead ajouté: Marie Dupont (8.5/10)"

   f. (si autoSend activé)
      → EmailService.send() pour chaque lead avec email
      → utilise le template cold_email
      → met le statut à CONTACTE
      → WebSocket: "Emails envoyés"

4. WebSocket: bot:done { total: 17 }

5. Frontend affiche "Terminé — 17 leads sauvegardés" dans le terminal
   → les leads apparaissent automatiquement dans LeadsPage

6. J+3 : FollowUpService détecte les leads sans réponse
   → envoie le template followup_j3

7. J+7 : FollowUpService envoie le template followup_j7
   → si toujours pas de réponse
```

---

*Documentation générée pour Lead Bot v1.0*
