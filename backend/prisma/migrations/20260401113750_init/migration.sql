-- CreateEnum
CREATE TYPE "Categorie" AS ENUM ('CHAUD', 'TIEDE', 'FROID');

-- CreateEnum
CREATE TYPE "Statut" AS ENUM ('NOUVEAU', 'CONTACTE', 'EN_COURS', 'CONVERTI', 'PERDU', 'BLACKLIST');

-- CreateEnum
CREATE TYPE "Canal" AS ENUM ('EMAIL', 'LINKEDIN', 'WHATSAPP', 'SMS');

-- CreateEnum
CREATE TYPE "StatutMessage" AS ENUM ('ENVOYE', 'ECHEC', 'EN_ATTENTE');

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT,
    "secteur" TEXT,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "categorie" "Categorie" NOT NULL DEFAULT 'FROID',
    "statut" "Statut" NOT NULL DEFAULT 'NOUVEAU',
    "source" TEXT,
    "titre" TEXT,
    "entreprise" TEXT,
    "linkedinUrl" TEXT,
    "telephone" TEXT,
    "taille" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "canal" "Canal" NOT NULL,
    "statut" "StatutMessage" NOT NULL DEFAULT 'ENVOYE',
    "opened" BOOLEAN NOT NULL DEFAULT false,
    "clicked" BOOLEAN NOT NULL DEFAULT false,
    "replied" BOOLEAN NOT NULL DEFAULT false,
    "content" TEXT,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bot_jobs" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'idle',
    "startedAt" TIMESTAMP(3),
    "stoppedAt" TIMESTAMP(3),
    "config" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bot_jobs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
