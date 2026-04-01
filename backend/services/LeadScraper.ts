import { chromium, Browser, BrowserContext, Page } from 'playwright';

interface ScrapedLead {
  nom: string;
  titre: string;
  entreprise: string;
  linkedinUrl: string;
  source: string;
  secteur: string;
}

interface ScrapeOptions {
  keywords: string;
  location?: string;
  limit?: number;
}

class LeadScraper {
  private browser: Browser | null = null;

  async init(): Promise<void> {
    this.browser = await chromium.launch({ headless: true });
  }

  async close(): Promise<void> {
    if (this.browser) await this.browser.close();
  }

  async scrapeLinkedIn({ keywords, location = '', limit = 20 }: ScrapeOptions): Promise<ScrapedLead[]> {
    if (!this.browser) await this.init();
    const context: BrowserContext = await this.browser!.newContext({
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });

    // Injecter le cookie li_at
    await context.addCookies([
      {
        name: 'li_at',
        value: process.env.LINKEDIN_COOKIE || '',
        domain: '.linkedin.com',
        path: '/',
      },
    ]);

    const page: Page = await context.newPage();
    const leads: ScrapedLead[] = [];

    try {
      const query = encodeURIComponent(keywords);
      const loc = location ? encodeURIComponent(location) : '';
      const url = `https://www.linkedin.com/search/results/people/?keywords=${query}${
        loc ? `&geoUrn=${loc}` : ''
      }&origin=GLOBAL_SEARCH_HEADER`;

      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(2000);

      // Vérifier si on est redirigé vers la page de login
      const currentUrl = page.url();
      if (currentUrl.includes('/login') || currentUrl.includes('/checkpoint')) {
        console.error('[LeadScraper] Cookie invalide — redirigé vers login');
        return [];
      }

      for (let i = 0; i < Math.ceil(limit / 10); i++) {
        await page.waitForTimeout(1500);

        // Sélecteurs modernes LinkedIn 2024
        const items = await page
          .$$eval('li.reusable-search__result-container', (nodes) =>
            nodes.map((node) => {
              const nameEl =
                node.querySelector('span[aria-hidden="true"]') ||
                node.querySelector('.entity-result__title-text a span[aria-hidden="true"]');
              const titleEl =
                node.querySelector('.entity-result__primary-subtitle') ||
                node.querySelector('[class*="primary-subtitle"]');
              const companyEl =
                node.querySelector('.entity-result__secondary-subtitle') ||
                node.querySelector('[class*="secondary-subtitle"]');
              const linkEl =
                node.querySelector('a.app-aware-link') || node.querySelector('a[href*="/in/"]');

              return {
                nom: (nameEl as any)?.textContent?.trim() || '',
                titre: (titleEl as any)?.textContent?.trim() || '',
                entreprise: (companyEl as any)?.textContent?.trim() || '',
                linkedinUrl: (linkEl as any)?.href?.split('?')[0] || '',
              };
            })
          )
          .catch(() => []);

        const valid = items.filter((l) => l.nom && l.nom !== 'LinkedIn Member');
        leads.push(...(valid as ScrapedLead[]));

        console.log(`[LeadScraper] Page ${i + 1}: ${valid.length} leads trouvés`);

        if (leads.length >= limit) break;

        const nextBtn = await page.$('button[aria-label="Next"]');
        if (!nextBtn) break;
        await nextBtn.click();
        await page.waitForTimeout(2000);
      }
    } catch (err: any) {
      console.error('[LeadScraper] Error:', err.message);
    } finally {
      await context.close();
    }

    return leads.slice(0, limit).map((l) => ({
      ...l,
      source: 'LinkedIn',
      secteur: keywords,
    }));
  }
}

export default new LeadScraper();
