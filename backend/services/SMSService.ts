import twilio from 'twilio';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface SendOptions {
  leadId: string;
  to: string;
  body: string;
}

class SMSService {
  _getClient() {
    return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }

  async send({ leadId, to, body }: SendOptions): Promise<{ success: boolean }> {
    try {
      await this._getClient().messages.create({
        from: process.env.TWILIO_PHONE,
        to,
        body,
      });

      await prisma.message.create({
        data: { leadId, canal: 'SMS', statut: 'ENVOYE', content: body.slice(0, 200) },
      });

      return { success: true };
    } catch (err: any) {
      await prisma.message.create({
        data: { leadId, canal: 'SMS', statut: 'ECHEC', content: err.message },
      });
      throw err;
    }
  }
}

export default new SMSService();
