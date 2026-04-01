import { chromium } from 'playwright';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface SendMessageOptions {
  leadId: string;
  profileUrl: string;
  message: string;
}

class LinkedInService {
  async sendMessage({ leadId, profileUrl, message }: SendMessageOptions): Promise<{ success: boolean }> {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      extraHTTPHeaders: { Cookie: `li_at=${process.env.LINKEDIN_COOKIE}` },
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

      await prisma.message.create({
        data: { leadId, canal: 'LINKEDIN', statut: 'ENVOYE', content: message.slice(0, 200) },
      });

      return { success: true };
    } catch (err: any) {
      await prisma.message.create({
        data: { leadId, canal: 'LINKEDIN', statut: 'ECHEC', content: err.message },
      });
      throw err;
    } finally {
      await browser.close();
    }
  }
}

export default new LinkedInService();
