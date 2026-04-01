interface Lead {
  nom: string;
  email?: string;
  secteur?: string;
  titre?: string;
  entreprise?: string;
  linkedinUrl?: string;
  taille?: string;
  score?: number;
  categorie?: string;
  [key: string]: any;
}

class LeadScorer {
  static SECTEURS_PREMIUM: string[] = ['SaaS', 'Fintech', 'IA', 'Cybersécurité', 'Cloud'];
  static TITRES_CLES: string[] = ['CEO', 'CTO', 'Fondateur', 'Directeur', 'VP', 'Head of', 'Chief'];

  score(lead: Lead): Lead {
    let score = 0;

    // Email disponible (+3)
    if (lead.email) score += 3;

    // Secteur premium (+2)
    if (lead.secteur && LeadScorer.SECTEURS_PREMIUM.some((s) => lead.secteur!.includes(s))) score += 2;

    // Titre décideur (+2)
    if (lead.titre && LeadScorer.TITRES_CLES.some((t) => lead.titre!.includes(t))) score += 2;

    // Taille entreprise (+1-2)
    if (lead.taille === '51-200') score += 1;
    if (lead.taille === '201-500' || lead.taille === '500+') score += 2;

    // LinkedIn disponible (+1)
    if (lead.linkedinUrl) score += 1;

    const finalScore = Math.min(10, Math.round(score * 10) / 10);
    const categorie = finalScore >= 7 ? 'CHAUD' : finalScore >= 4 ? 'TIEDE' : 'FROID';

    return { ...lead, score: finalScore, categorie };
  }

  scoreBatch(leads: Lead[]): Lead[] {
    return leads.map((l) => this.score(l));
  }
}

export default new LeadScorer();
