import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface SendOptions {
  leadId: string;
  to: string;
  subject?: string;
  html?: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com',
      port: parseInt(process.env.BREVO_SMTP_PORT || '587'),
      auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASS,
      },
    });
  }

  async send({ leadId, to, subject, html, text }: SendOptions): Promise<{ success: boolean }> {
    try {
      await this.transporter.sendMail({
        from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
        to,
        subject,
        html,
        text,
      });

      await prisma.message.create({
        data: { leadId, canal: 'EMAIL', statut: 'ENVOYE', content: subject || '' },
      });

      return { success: true };
    } catch (err: any) {
      await prisma.message.create({
        data: { leadId, canal: 'EMAIL', statut: 'ECHEC', content: err.message },
      });
      throw err;
    }
  }
}

export default new EmailService();
