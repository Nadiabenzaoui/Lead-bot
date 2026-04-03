import axios from 'axios';
import { config } from '../config';

const HUNTER_DELAY_MS = 300;

interface Lead {
  nom: string;
  entreprise?: string;
  email?: string;
  [key: string]: any;
}

class LeadEnricher {
  async enrichFromHunter(lead: Lead): Promise<Lead> {
    const { nom, entreprise } = lead;
    if (!entreprise) return lead;

    try {
      const domain = await this._getDomain(entreprise);
      if (!domain) return lead;

      const parts = nom.split(' ');
      const firstName = parts[0] || '';
      const lastName = parts[parts.length - 1] || '';

      const res = await axios.get('https://api.hunter.io/v2/email-finder', {
        params: {
          domain,
          first_name: firstName,
          last_name: lastName,
          api_key: config.hunter.apiKey,
        },
      });

      const email: string | undefined = res.data?.data?.email;
      if (email) return { ...lead, email };
    } catch (err: any) {
      console.error('[LeadEnricher] Hunter error:', err.message);
    }

    return lead;
  }

  async _getDomain(company: string): Promise<string | null> {
    try {
      const res = await axios.get('https://api.hunter.io/v2/domain-search', {
        params: { company, api_key: config.hunter.apiKey, limit: 1 },
      });
      return res.data?.data?.domain || null;
    } catch {
      return null;
    }
  }

  async enrichBatch(leads: Lead[]): Promise<Lead[]> {
    const results: Lead[] = [];
    for (const lead of leads) {
      const enriched = await this.enrichFromHunter(lead);
      results.push(enriched);
      await new Promise((r) => setTimeout(r, HUNTER_DELAY_MS));
    }
    return results;
  }
}

export default new LeadEnricher();
