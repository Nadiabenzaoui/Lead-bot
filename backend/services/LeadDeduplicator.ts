import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Lead {
  nom?: string;
  email?: string;
  entreprise?: string;
  [key: string]: any;
}

class LeadDeduplicator {
  _normalize(str: string | undefined): string {
    return (str || '').toLowerCase().trim().replace(/\s+/g, ' ');
  }

  async deduplicate(leads: Lead[]): Promise<Lead[]> {
    const unique: Lead[] = [];
    const seen = new Set<string>();

    // Check against DB
    const existingEmails = new Set(
      (await prisma.lead.findMany({ select: { email: true } }))
        .map((l) => l.email?.toLowerCase())
        .filter(Boolean) as string[]
    );

    for (const lead of leads) {
      const key = lead.email
        ? lead.email.toLowerCase()
        : `${this._normalize(lead.nom)}|${this._normalize(lead.entreprise)}`;

      if (!seen.has(key) && !existingEmails.has(lead.email?.toLowerCase() as string)) {
        seen.add(key);
        unique.push(lead);
      }
    }

    return unique;
  }
}

export default new LeadDeduplicator();
