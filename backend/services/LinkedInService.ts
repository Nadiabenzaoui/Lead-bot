import { chromium } from 'playwright';
import { config } from '../config';
import { logMessage } from '../lib/logMessage';

interface SendMessageOptions {
  leadId: string;
  profileUrl: string;
  message: string;
}

class LinkedInService {
  async sendMessage({ leadId, profileUrl, message }: SendMessageOptions): Promise<{ success: boolean }> {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      extraHTTPHeaders: { Cookie: `li_at=${config.linkedin.cookie}` },
    });
    const page = await context.newPage();

    try {
      await page.goto(profileUrl, { waitUntil: 'networkidle', timeout: 30000 });
      const msgBtn = await page.$('button[aria-label*="Message"]');
      if (!msgBtn) throw new Error('Message button not found');

      await msgBtn.click();
      await page.waitForSelector('.msg-form__contenteditable', { timeout: 5000 });
      await page.fill('.msg-form__contenteditable', message);
      await page.click('button[type="submit"]');
      await page.waitForTimeout(1000);

      await logMessage({ leadId, canal: 'LINKEDIN', statut: 'ENVOYE', content: message });
      return { success: true };
    } catch (err: any) {
      await logMessage({ leadId, canal: 'LINKEDIN', statut: 'ECHEC', content: err.message });
      throw err;
    } finally {
      await browser.close();
    }
  }
}

export default new LinkedInService();
