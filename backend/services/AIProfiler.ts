import OpenAI from 'openai';
import { config } from '../config';

interface Lead {
  nom: string;
  titre?: string;
  entreprise?: string;
  secteur?: string;
  [key: string]: any;
}

interface GenerateMessageOptions {
  lead: Lead;
  canal?: string;
  context?: string;
}

interface AnalyzeProfileResult {
  potentiel: string;
  raison: string;
  meilleurCanal: string;
  messageIdeal?: string;
}

class AIProfiler {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({ apiKey: config.openai.apiKey });
  }

  async generateMessage({ lead, canal = 'email', context = '' }: GenerateMessageOptions): Promise<string> {
    const prompt = `Tu es un expert en prospection B2B.
Génère un message de prospection personnalisé pour ce lead :
- Nom : ${lead.nom}
- Titre : ${lead.titre || 'inconnu'}
- Entreprise : ${lead.entreprise || 'inconnue'}
- Secteur : ${lead.secteur || 'inconnu'}
- Canal : ${canal}
${context ? `Contexte supplémentaire : ${context}` : ''}

Règles :
- Court, percutant, personnalisé
- Pas de formule générique
- CTA clair à la fin
- Longueur : max 150 mots pour email, 50 mots pour SMS/WhatsApp

Réponds uniquement avec le message, sans explication.`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
    });

    return response.choices[0].message.content?.trim() || '';
  }

  async analyzeProfile(lead: Lead): Promise<AnalyzeProfileResult> {
    const prompt = `Analyse ce profil de lead B2B et donne une évaluation en JSON :
${JSON.stringify(lead, null, 2)}

Retourne uniquement un JSON avec :
{
  "potentiel": "haut|moyen|faible",
  "raison": "string",
  "meilleurCanal": "email|linkedin|whatsapp|sms",
  "messageIdeal": "string (50 mots max)"
}`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      max_tokens: 300,
    });

    try {
      return JSON.parse(response.choices[0].message.content || '{}') as AnalyzeProfileResult;
    } catch {
      return { potentiel: 'moyen', raison: 'Analyse indisponible', meilleurCanal: 'email' };
    }
  }
}

export default new AIProfiler();
