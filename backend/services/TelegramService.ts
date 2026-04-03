import axios from 'axios';
import { config } from '../config';
import { logMessage } from '../lib/logMessage';

interface SendOptions {
  leadId: string;
  chatId: string;
  text: string;
}

class TelegramService {
  async send({ leadId, chatId, text }: SendOptions): Promise<{ success: boolean }> {
    try {
      await axios.post(`https://api.telegram.org/bot${config.telegram.botToken}/sendMessage`, {
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
      });

      await logMessage({ leadId, canal: 'TELEGRAM', statut: 'ENVOYE', content: text });
      return { success: true };
    } catch (err: any) {
      await logMessage({ leadId, canal: 'TELEGRAM', statut: 'ECHEC', content: err.message });
      throw err;
    }
  }
}

export default new TelegramService();
