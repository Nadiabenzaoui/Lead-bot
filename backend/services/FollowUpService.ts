import { PrismaClient } from '@prisma/client';
import EmailService from './EmailService';
import TemplateEngine from './TemplateEngine';

const prisma = new PrismaClient();

class FollowUpService {
  async checkAndSend(): Promise<void> {
    const now = new Date();
    const j3 = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const j7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Find leads with initial email sent ~3 days ago (no reply)
    const leadsJ3 = await prisma.lead.findMany({
      where: {
        statut: 'CONTACTE',
        messages: {
          some: {
            canal: 'EMAIL',
            statut: 'ENVOYE',
            replied: false,
            sentAt: { gte: new Date(j3.getTime() - 3600000), lte: new Date(j3.getTime() + 3600000) },
          },
        },
      },
      include: { messages: true },
    });

    for (const lead of leadsJ3) {
      if (!lead.email) continue;
      const hasFollowup = lead.messages.some((m) => m.content?.includes('relance'));
      if (hasFollowup) continue;

      const tpl = TemplateEngine.render('followup_j3', {
        prenom: lead.nom.split(' ')[0],
        entreprise: lead.entreprise || '',
        expediteur: process.env.FROM_NAME,
      });

      await EmailService.send({
        leadId: lead.id,
        to: lead.email,
        subject: tpl.subject,
        html: tpl.html,
      });
      console.log(`[FollowUp] J+3 sent to ${lead.email}`);
    }

    // J+7 relance
    const leadsJ7 = await prisma.lead.findMany({
      where: {
        statut: 'CONTACTE',
        messages: {
          some: {
            canal: 'EMAIL',
            statut: 'ENVOYE',
            replied: false,
            sentAt: { gte: new Date(j7.getTime() - 3600000), lte: new Date(j7.getTime() + 3600000) },
          },
        },
      },
      include: { messages: true },
    });

    for (const lead of leadsJ7) {
      if (!lead.email) continue;
      const tpl = TemplateEngine.render('followup_j7', {
        prenom: lead.nom.split(' ')[0],
        entreprise: lead.entreprise || '',
        expediteur: process.env.FROM_NAME,
      });

      await EmailService.send({
        leadId: lead.id,
        to: lead.email,
        subject: tpl.subject,
        html: tpl.html,
      });
      console.log(`[FollowUp] J+7 sent to ${lead.email}`);
    }
  }
}

export default new FollowUpService();
