interface TemplateDefinition {
  subject?: string;
  html?: string;
  text?: string;
}

interface RenderedTemplate {
  subject?: string;
  html?: string;
  text?: string;
}

interface TemplateVariables {
  [key: string]: string | undefined;
}

class TemplateEngine {
  static TEMPLATES: Record<string, TemplateDefinition> = {
    cold_email: {
      subject: 'Question rapide pour {{entreprise}}',
      html: `<p>Bonjour {{prenom}},</p>
<p>J'ai vu que {{entreprise}} travaille dans le secteur <strong>{{secteur}}</strong>.</p>
<p>On aide des entreprises similaires à générer +30% de leads qualifiés en 90 jours.</p>
<p>Seriez-vous disponible pour un échange de 15 min cette semaine ?</p>
<p>Cordialement,<br>{{expediteur}}</p>`,
    },
    followup_j3: {
      subject: 'Re: Question rapide pour {{entreprise}}',
      html: `<p>Bonjour {{prenom}},</p>
<p>Je me permets de relancer suite à mon email de l'autre jour.</p>
<p>Avez-vous eu l'occasion d'y jeter un œil ?</p>
<p>{{expediteur}}</p>`,
    },
    followup_j7: {
      subject: 'Dernière tentative — {{entreprise}}',
      html: `<p>Bonjour {{prenom}},</p>
<p>Je ne veux pas vous importuner, c'est mon dernier email.</p>
<p>Si le timing n'est pas bon, dites-le moi et je reviens dans quelques mois.</p>
<p>{{expediteur}}</p>`,
    },
    linkedin_connect: {
      text: `Bonjour {{prenom}}, je travaille avec des {{secteur}} comme {{entreprise}} sur des sujets de croissance. Ravi de connecter !`,
    },
    sms: {
      text: `Bonjour {{prenom}}, {{expediteur}} ici. Question rapide sur {{entreprise}} — dispo 5 min ? 👋`,
    },
    telegram_intro: {
      text: `Bonjour {{prenom}} ! Je travaille avec des entreprises du secteur {{secteur}} et j'ai pensé à vous en voyant {{entreprise}}. Seriez-vous ouvert à un échange rapide ?`,
    },
  };

  render(templateKey: string, variables: TemplateVariables): RenderedTemplate {
    const template = TemplateEngine.TEMPLATES[templateKey];
    if (!template) throw new Error(`Template "${templateKey}" introuvable`);

    const replace = (str: string): string =>
      str.replace(/\{\{(\w+)\}\}/g, (_, key: string) => variables[key] || `{{${key}}}`);

    return {
      subject: template.subject ? replace(template.subject) : undefined,
      html: template.html ? replace(template.html) : undefined,
      text: template.text ? replace(template.text) : undefined,
    };
  }

  listTemplates(): string[] {
    return Object.keys(TemplateEngine.TEMPLATES);
  }
}

export default new TemplateEngine();
