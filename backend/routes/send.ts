import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import EmailService from '../services/EmailService';
import LinkedInService from '../services/LinkedInService';
import WhatsAppService from '../services/WhatsAppService';
import SMSService from '../services/SMSService';
import AIProfiler from '../services/AIProfiler';
import TemplateEngine from '../services/TemplateEngine';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { leadId, canal, templateKey, customMessage, useAI } = req.body as {
      leadId: string;
      canal: string;
      templateKey?: string;
      customMessage?: string;
      useAI?: boolean;
    };

    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) return res.status(404).json({ error: 'Lead not found' });

    let message: string | undefined = customMessage;

    if (useAI && !message) {
      message = await AIProfiler.generateMessage({ lead, canal });
    } else if (templateKey && !message) {
      const rendered = TemplateEngine.render(templateKey, {
        prenom: lead.nom.split(' ')[0],
        entreprise: lead.entreprise || '',
        secteur: lead.secteur || '',
        expediteur: process.env.FROM_NAME,
      });
      message = rendered.html || rendered.text;
    }

    let result: { success: boolean };
    switch (canal) {
      case 'EMAIL':
        if (!lead.email) return res.status(400).json({ error: 'No email for this lead' });
        result = await EmailService.send({
          leadId,
          to: lead.email,
          subject: `Message pour ${lead.nom}`,
          html: message,
        });
        break;
      case 'LINKEDIN':
        if (!lead.linkedinUrl) return res.status(400).json({ error: 'No LinkedIn URL' });
        result = await LinkedInService.sendMessage({ leadId, profileUrl: lead.linkedinUrl, message: message || '' });
        break;
      case 'WHATSAPP':
        if (!lead.telephone) return res.status(400).json({ error: 'No phone number' });
        result = await WhatsAppService.send({ leadId, to: lead.telephone, body: message || '' });
        break;
      case 'SMS':
        if (!lead.telephone) return res.status(400).json({ error: 'No phone number' });
        result = await SMSService.send({ leadId, to: lead.telephone, body: message || '' });
        break;
      default:
        return res.status(400).json({ error: 'Invalid canal' });
    }

    await prisma.lead.update({ where: { id: leadId }, data: { statut: 'CONTACTE' } });
    res.json({ success: true, result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
