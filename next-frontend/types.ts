export type Categorie = 'CHAUD' | 'TIEDE' | 'FROID';
export type Statut = 'NOUVEAU' | 'CONTACTE' | 'EN_COURS' | 'CONVERTI' | 'PERDU' | 'BLACKLIST';
export type Canal = 'EMAIL' | 'LINKEDIN' | 'WHATSAPP' | 'SMS' | 'TELEGRAM';
export type StatutMessage = 'ENVOYE' | 'ECHEC' | 'EN_ATTENTE';

export interface Message {
  id: string;
  leadId: string;
  canal: Canal;
  statut: StatutMessage;
  opened: boolean;
  clicked: boolean;
  replied: boolean;
  content?: string;
  sentAt: string;
}

export interface Lead {
  id: string;
  nom: string;
  email?: string;
  secteur?: string;
  score: number;
  categorie: Categorie;
  statut: Statut;
  source?: string;
  titre?: string;
  entreprise?: string;
  linkedinUrl?: string;
  telephone?: string;
  taille?: string;
  notes?: string;
  telegramId?: string;
  createdAt: string;
  updatedAt: string;
  messages?: Message[];
}

export interface LeadsResponse {
  leads: Lead[];
  total: number;
  page: number;
  limit: number;
}

export interface LeadFilters {
  search?: string;
  categorie?: string;
  statut?: string;
  page?: number;
}

export interface MonitorStats {
  totalLeads: number;
  totalMessages: number;
  openRate: number;
  clickRate: number;
  replyRate: number;
  byCategorie: { categorie: string; _count: number }[];
  byCanal: { canal: string; _count: number }[];
  recentLeads: { nom: string; score: number; categorie: string; createdAt: string }[];
}

export interface BotStatus {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  lastJob?: any;
}

export interface LogEntry {
  type: 'log' | 'lead' | 'done' | 'error' | 'warn';
  message: string;
  step?: string;
  ts: string;
}

export interface BotConfig {
  keywords: string;
  location: string;
  limit: number;
  autoSend: boolean;
}

export interface SendForm {
  leadId: string;
  canal: Canal;
  templateKey: string;
  customMessage: string;
  useAI: boolean;
}

