import axios from 'axios';
import { config } from '../config';

interface ScrapedLead {
  nom: string;
  titre: string;
  entreprise: string;
  email?: string;
  linkedinUrl?: string;
  source: string;
  secteur: string;
}

interface ScrapeOptions {
  keywords: string; // domain ex: "stripe.com"
  location?: string;
  limit?: number;
}

class LeadScraper {
  async scrapeLinkedIn({ keywords, limit = 20 }: ScrapeOptions): Promise<ScrapedLead[]> {
    const domain = keywords.trim().toLowerCase();

    try {
      const hunterLimit = Math.min(Math.max(1, limit), 100);
      const res = await axios.get('https://api.hunter.io/v2/domain-search', {
        params: {
          domain,
          limit: hunterLimit,
          api_key: config.hunter.apiKey,
        },
      });

      const data = res.data?.data;
      if (!data) return [];

      const company: string = data.organization || domain;
      const industry: string = data.industry || '';
      const emails: any[] = data.emails || [];

      const leads: ScrapedLead[] = emails
        .filter((e: any) => e.first_name || e.last_name)
        .slice(0, limit)
        .map((e: any) => ({
          nom: `${e.first_name || ''} ${e.last_name || ''}`.trim(),
          titre: e.position || '',
          entreprise: company,
          email: e.value || undefined,
          linkedinUrl: e.linkedin || undefined,
          source: 'Hunter.io',
          secteur: industry || keywords,
        }));

      console.log(`[LeadScraper] Hunter.io: ${leads.length} leads trouvés pour ${domain}`);
      return leads;
    } catch (err: any) {
      console.error('[LeadScraper] Hunter.io error:', err.response?.data?.errors || err.message);
      return [];
    }
  }
}

export default new LeadScraper();
