const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const secteurs = ['SaaS', 'E-commerce', 'Fintech', 'Santé', 'RH', 'Marketing', 'Immobilier', 'Logistique'];
const tailles = ['1-10', '11-50', '51-200', '201-500', '500+'];
const sources = ['LinkedIn', 'Hunter.io', 'Manuel', 'Import CSV'];

const leads = Array.from({ length: 20 }, (_, i) => {
  const score = Math.round(Math.random() * 10 * 10) / 10;
  return {
    nom: `Contact ${i + 1}`,
    email: `contact${i + 1}@entreprise${i + 1}.com`,
    secteur: secteurs[i % secteurs.length],
    score,
    categorie: score >= 7 ? 'CHAUD' : score >= 4 ? 'TIEDE' : 'FROID',
    statut: ['NOUVEAU', 'CONTACTE', 'EN_COURS'][Math.floor(Math.random() * 3)],
    source: sources[i % sources.length],
    titre: ['CEO', 'CTO', 'Directeur Commercial', 'Fondateur'][i % 4],
    entreprise: `Entreprise ${i + 1}`,
    taille: tailles[i % tailles.length],
  };
});

async function main() {
  console.log('Seeding database...');
  await prisma.lead.deleteMany();
  await prisma.message.deleteMany();

  for (const lead of leads) {
    const created = await prisma.lead.create({ data: lead });
    if (Math.random() > 0.5) {
      await prisma.message.create({
        data: {
          leadId: created.id,
          canal: ['EMAIL', 'LINKEDIN', 'SMS'][Math.floor(Math.random() * 3)],
          statut: 'ENVOYE',
          opened: Math.random() > 0.5,
          clicked: Math.random() > 0.7,
          replied: Math.random() > 0.8,
        }
      });
    }
  }

  console.log('Done! 20 leads created.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
