import React from 'react';
import type { Categorie, Statut } from '../../types';
import { TIER_LABELS, TIER_COLORS, TIER_DOT_COLORS, STATUT_COLORS, STATUTS } from '../../constants';

interface TierBadgeProps {
  categorie: Categorie;
}

export function TierBadge({ categorie }: TierBadgeProps) {
  return (
    <span className={`flex items-center gap-1.5 ${TIER_COLORS[categorie]}`}>
      <span className={`inline-block w-1.5 h-1.5 rounded-full ${TIER_DOT_COLORS[categorie]}`} />
      <span className="text-xs font-medium">{TIER_LABELS[categorie]}</span>
    </span>
  );
}

interface StatusBadgeProps {
  statut: Statut;
  onChange?: (statut: Statut) => void;
  statuts?: readonly Statut[];
}

export function StatusBadge({ statut, onChange, statuts = STATUTS }: StatusBadgeProps) {
  if (!onChange) {
    return (
      <span className={`text-xs px-2 py-0.5 rounded border ${STATUT_COLORS[statut]}`}>
        {statut}
      </span>
    );
  }
  return (
    <select
      value={statut}
      onChange={e => onChange(e.target.value as Statut)}
      className={`text-xs bg-transparent border rounded px-1.5 py-0.5 ${STATUT_COLORS[statut]}`}
    >
      {statuts.map(s => (
        <option key={s} value={s} className="bg-zinc-900 text-zinc-100">{s}</option>
      ))}
    </select>
  );
}

