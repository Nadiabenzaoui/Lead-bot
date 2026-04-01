import Bull from 'bull';
import { PrismaClient } from '@prisma/client';
import { Server } from 'socket.io';
import LeadScraper from '../services/LeadScraper';
import LeadEnricher from '../services/LeadEnricher';
import LeadScorer from '../services/LeadScorer';
import LeadDeduplicator from '../services/LeadDeduplicator';
import EmailService from '../services/EmailService';
import TemplateEngine from '../services/TemplateEngine';

const prisma = new PrismaClient();

let io: Server | null = null;

const botQueue = new Bull('bot-queue', {
  redis: process.env.REDIS_URL || 'redis://localhost:6379',
});

export function setIO(socketIO: Server): void {
  io = socketIO;
}

function emit(event: string, data: any): void {
  if (io) io.emit(event, data);
}

botQueue.process('scrape-and-send', async (job) => {
  const { keywords, location, limit, autoSend } = job.data as {
    keywords: string;
    location: string;
    limit: number;
    autoSend: boolean;
  };

  emit('bot:log', { message: `Démarrage scraping: "${keywords}"`, step: 'scrape' });

  // 1. Scrape
  let leads: any[] = await LeadScraper.scrapeLinkedIn({ keywords, location, limit });
  emit('bot:log', { message: `${leads.length} leads scrapés`, step: 'scrape' });

  // 2. Enrich
  emit('bot:log', { message: 'Enrichissement emails...', step: 'enrich' });
  leads = await LeadEnricher.enrichBatch(leads);
  const enriched = leads.filter((l) => l.email).length;
  emit('bot:log', { message: `${enriched} emails trouvés`, step: 'enrich' });

  // 3. Score
  leads = LeadScorer.scoreBatch(leads);
  emit('bot:log', { message: 'Scoring terminé', step: 'score' });

  // 4. Dedup
  leads = await LeadDeduplicator.deduplicate(leads);
  emit('bot:log', { message: `${leads.length} leads uniques après déduplication`, step: 'dedup' });

  // 5. Save to DB
  const saved: any[] = [];
  for (const lead of leads) {
    try {
      const created = await prisma.lead.create({ data: lead });
      saved.push(created);
      emit('bot:lead', created);
    } catch (err: any) {
      console.error('[Bot] Save error:', err.message);
    }
  }

  // 6. Auto-send emails if enabled
  if (autoSend) {
    emit('bot:log', { message: 'Envoi emails cold...', step: 'send' });
    for (const lead of saved.filter((l) => l.email)) {
      try {
        const tpl = TemplateEngine.render('cold_email', {
          prenom: lead.nom.split(' ')[0],
          entreprise: lead.entreprise || '',
          secteur: lead.secteur || '',
          expediteur: process.env.FROM_NAME,
        });
        await EmailService.send({ leadId: lead.id, to: lead.email, subject: tpl.subject, html: tpl.html });
        await prisma.lead.update({ where: { id: lead.id }, data: { statut: 'CONTACTE' } });
      } catch (err: any) {
        console.error('[Bot] Email error:', err.message);
      }
    }
    emit('bot:log', { message: 'Emails envoyés', step: 'send' });
  }

  emit('bot:done', { total: saved.length });
  return { total: saved.length };
});

botQueue.on('failed', (job, err: Error) => {
  emit('bot:error', { message: err.message });
  console.error('[Bot] Job failed:', err);
});

export { botQueue };
