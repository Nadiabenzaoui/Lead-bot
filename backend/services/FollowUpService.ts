import { prisma } from '../lib/prisma';
import { config } from '../config';
import EmailService from './EmailService';
import TemplateEngine from './TemplateEngine';

const DAY_MS = 24 * 60 * 60 * 1000;
const WINDOW_MS = 60 * 60 * 1000; // ±1h tolerance

class FollowUpService {
  async checkAndSend(): Promise<void> {
    const now = new Date();
    await Promise.all([
      this._sendFollowups(now, 3, 'followup_j3', 'J+3'),
      this._sendFollowups(now, 7, 'followup_j7', 'J+7'),
    ]);
  }

  private async _sendFollowups(
    now: Date,
    daysAgo: number,
    templateKey: string,
    label: string
  ): Promise<void> {
    const target = new Date(now.getTime() - daysAgo * DAY_MS);

    const leads = await prisma.lead.findMany({
      where: {
        statut: 'CONTACTE',
        messages: {
          some: {
            canal: 'EMAIL',
            statut: 'ENVOYE',
            replied: false,
            sentAt: {
              gte: new Date(target.getTime() - WINDOW_MS),
              lte: new Date(target.getTime() + WINDOW_MS),
            },
          },
        },
      },
      include: { messages: true },
    });

    for (const lead of leads) {
      if (!lead.email) continue;
      const alreadySent = lead.messages.some((m) => m.content?.includes('relance'));
      if (alreadySent) continue;

      const tpl = TemplateEngine.render(templateKey, {
        prenom: lead.nom.split(' ')[0],
        entreprise: lead.entreprise || '',
        expediteur: config.email.fromName,
      });

      await EmailService.send({ leadId: lead.id, to: lead.email, subject: tpl.subject, html: tpl.html });
      console.log(`[FollowUp] ${label} sent to ${lead.email}`);
    }
  }
}

export default new FollowUpService();
