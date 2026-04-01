import type { Categorie, Statut, Canal } from './types';

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
export const CANALS: readonly Canal[] = ['EMAIL', 'LINKEDIN', 'WHATSAPP', 'SMS'];
export const TEMPLATES = ['cold_email', 'followup_j3', 'followup_j7', 'linkedin_connect', 'sms'] as const;

export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
