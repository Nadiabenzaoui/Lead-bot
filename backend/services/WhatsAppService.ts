import twilio from 'twilio';
import { config } from '../config';
import { logMessage } from '../lib/logMessage';

interface SendOptions {
  leadId: string;
  to: string;
  body: string;
}

class WhatsAppService {
  private get client() {
    return twilio(config.twilio.accountSid, config.twilio.authToken);
  }

  async send({ leadId, to, body }: SendOptions): Promise<{ success: boolean }> {
    try {
      await this.client.messages.create({
        from: config.twilio.whatsappFrom,
        to: `whatsapp:${to}`,
        body,
      });

      await logMessage({ leadId, canal: 'WHATSAPP', statut: 'ENVOYE', content: body });
      return { success: true };
    } catch (err: any) {
      await logMessage({ leadId, canal: 'WHATSAPP', statut: 'ECHEC', content: err.message });
      throw err;
    }
  }
}

export default new WhatsAppService();
