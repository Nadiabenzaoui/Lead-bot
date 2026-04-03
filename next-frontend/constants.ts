import type { Categorie, Statut, Canal } from './types';

export const TIER_BAR_COLORS: Record<Categorie, string> = {
  CHAUD: 'bg-violet-500',
  TIEDE: 'bg-fuchsia-400',
  FROID: 'bg-slate-300',
};

export const TIER_BAR_TEXT: Record<Categorie, string> = {
  CHAUD: 'text-violet-700',
  TIEDE: 'text-fuchsia-600',
  FROID: 'text-slate-500',
};

export const CANAL_LABELS: Record<Canal, string> = {
  EMAIL: 'Email',
  LINKEDIN: 'LinkedIn',
  WHATSAPP: 'WhatsApp',
  SMS: 'SMS',
  TELEGRAM: 'Telegram',
};

export const CANAL_BAR_COLORS: Record<Canal, string> = {
  EMAIL: 'bg-violet-500',
  LINKEDIN: 'bg-blue-500',
  WHATSAPP: 'bg-emerald-500',
  SMS: 'bg-amber-500',
  TELEGRAM: 'bg-sky-500',
};

export const CANAL_TEXT_COLORS: Record<Canal, string> = {
  EMAIL: 'text-violet-600',
  LINKEDIN: 'text-blue-600',
  WHATSAPP: 'text-emerald-600',
  SMS: 'text-amber-600',
  TELEGRAM: 'text-sky-600',
};

export const TIER_LABELS: Record<Categorie, string> = {
  CHAUD: 'Tier A',
  TIEDE: 'Tier B',
  FROID: 'Tier C',
};

export const TIER_COLORS: Record<Categorie, string> = {
  CHAUD: 'text-emerald-400',
  TIEDE: 'text-blue-400',
  FROID: 'text-zinc-400',
};

export const TIER_DOT_COLORS: Record<Categorie, string> = {
  CHAUD: 'bg-emerald-400',
  TIEDE: 'bg-blue-400',
  FROID: 'bg-zinc-400',
};

export const STATUT_COLORS: Record<Statut, string> = {
  NOUVEAU: 'text-zinc-400 border-zinc-700',
  CONTACTE: 'text-amber-400 border-amber-700',
  EN_COURS: 'text-blue-400 border-blue-700',
  CONVERTI: 'text-emerald-400 border-emerald-700',
  PERDU: 'text-red-400 border-red-700',
  BLACKLIST: 'text-zinc-600 border-zinc-800',
};

export const STATUTS: readonly Statut[] = ['NOUVEAU', 'CONTACTE', 'EN_COURS', 'CONVERTI', 'PERDU', 'BLACKLIST'];
export const CATEGORIES: readonly Categorie[] = ['CHAUD', 'TIEDE', 'FROID'];
export const CANALS: readonly Canal[] = ['EMAIL', 'LINKEDIN', 'WHATSAPP', 'SMS', 'TELEGRAM'];
export const TEMPLATES = ['cold_email', 'followup_j3', 'followup_j7', 'linkedin_connect', 'sms', 'telegram_intro'] as const;

