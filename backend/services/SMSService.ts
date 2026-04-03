import twilio from 'twilio';
import { config } from '../config';
import { logMessage } from '../lib/logMessage';

interface SendOptions {
  leadId: string;
  to: string;
  body: string;
}

class SMSService {
  private get client() {
    return twilio(config.twilio.accountSid, config.twilio.authToken);
  }

  async send({ leadId, to, body }: SendOptions): Promise<{ success: boolean }> {
    try {
      await this.client.messages.create({
        from: config.twilio.phone,
        to,
        body,
      });

      await logMessage({ leadId, canal: 'SMS', statut: 'ENVOYE', content: body });
      return { success: true };
    } catch (err: any) {
      await logMessage({ leadId, canal: 'SMS', statut: 'ECHEC', content: err.message });
      throw err;
    }
  }
}

export default new SMSService();
