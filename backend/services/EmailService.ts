import nodemailer from 'nodemailer';
import { config } from '../config';
import { logMessage } from '../lib/logMessage';

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
      host: config.email.host,
      port: config.email.port,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });
  }

  async send({ leadId, to, subject, html, text }: SendOptions): Promise<{ success: boolean }> {
    try {
      await this.transporter.sendMail({
        from: `"${config.email.fromName}" <${config.email.fromEmail}>`,
        to,
        subject,
        html,
        text,
      });

      await logMessage({ leadId, canal: 'EMAIL', statut: 'ENVOYE', content: subject || '' });
      return { success: true };
    } catch (err: any) {
      await logMessage({ leadId, canal: 'EMAIL', statut: 'ECHEC', content: err.message });
      throw err;
    }
  }
}

export default new EmailService();
