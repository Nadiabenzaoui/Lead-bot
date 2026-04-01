"use client";

import React, { useRef, useState, useEffect } from 'react';
import { useLeads } from '../../../hooks/useLeads';
import { TierBadge, StatusBadge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { EmptyState } from '../../../components/ui/EmptyState';
import { CATEGORIES, TIER_LABELS, TIER_DOT_COLORS, STATUTS } from '../../../constants';

const LIMIT = 20;

function SearchIcon(): React.ReactElement {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function PlusIcon(): React.ReactElement {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function ExportIcon(): React.ReactElement {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function DotsIcon(): React.ReactElement {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </svg>
  );
}

interface ActionMenuProps {
  leadId: string;
  onDelete: (id: string) => void;
}

function ActionMenu({ leadId, onDelete }: ActionMenuProps): React.ReactElement {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="opacity-0 group-hover:opacity-100 flex items-center justify-center w-6 h-6 rounded text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all"
      >
        <DotsIcon />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-36 bg-slate-50 border border-slate-200 rounded-lg shadow-xl z-20 py-1 overflow-hidden">
          <button
            onClick={() => { onDelete(leadId); setOpen(false); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors text-left"
          >
            Delete lead
          </button>
        </div>
      )}
    </div>
  );
}

function getScoreColor(score: number, categorie?: string): string {
  const MAP: Record<string, string> = {
    CHAUD: 'text-violet-600',
    TIEDE: 'text-fuchsia-500',
    FROID: 'text-slate-500',
  };
  if (categorie && MAP[categorie]) return MAP[categorie];
  if (score >= 7) return 'text-violet-600';
  if (score >= 4) return 'text-fuchsia-500';
  return 'text-slate-500';
}

const STATUT_LABELS: Record<string, string> = {
  NOUVEAU: 'New',
  CONTACTE: 'Contacted',
  EN_COURS: 'In Progress',
  CONVERTI: 'Converted',
  PERDU: 'Lost',
  BLACKLIST: 'Blacklist',
};

export default function LeadsContent(): React.ReactElement {
  const { leads, total, loading, filters, updateFilters, setPage, deleteLead, updateStatut } = useLeads();

  const page = filters.page ?? 1;
  const from = (page - 1) * LIMIT + 1;
  const to = Math.min(page * LIMIT, total);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this lead?')) return;
    await deleteLead(id);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold text-slate-900 tracking-tight">Leads</h1>
          <span className="text-xs text-slate-500 tabular-nums font-mono">{total} leads</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="http://localhost:3001/export?format=csv"
            className="flex items-center gap-1.5 px-2.5 py-1.5 border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 text-xs font-medium rounded-md transition-colors"
          >
            <ExportIcon />
            Export CSV
          </a>
          <Button size="sm" variant="primary" className="rounded-md text-xs font-medium py-1.5 px-2.5">
            <PlusIcon />
            New Lead
          </Button>
        </div>
      </div>

      <div className="px-6 py-3 border-b border-slate-200 flex items-center gap-4">
        <div className="relative">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
            <SearchIcon />
          </span>
          <input
            className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-900 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 w-60 transition-colors"
            placeholder="Search leads..."
            value={filters.search ?? ''}
            onChange={e => updateFilters({ search: e.target.value })}
          />
        </div>

        <div className="flex items-center gap-0">
          <button
            onClick={() => updateFilters({ categorie: '' })}
            className={`px-3 py-1.5 text-xs font-medium transition-colors border-b-2 ${
              !filters.categorie
                ? 'border-violet-600 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            All
          </button>
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => updateFilters({ categorie: filters.categorie === c ? '' : c })}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors border-b-2 ${
                filters.categorie === c
                  ? 'border-violet-600 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${TIER_DOT_COLORS[c]}`} />
              {TIER_LABELS[c]}
            </button>
          ))}
        </div>

        <select
          className="ml-auto px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-500 focus:outline-none focus:border-zinc-600 transition-colors"
          value={filters.statut ?? ''}
          onChange={e => updateFilters({ statut: e.target.value })}
        >
          <option value="">All statuses</option>
          {STATUTS.map(s => (
            <option key={s} value={s}>{STATUT_LABELS[s] || s}</option>
          ))}
        </select>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-white border-b border-slate-200">
            <tr>
              {['Name', 'Company', 'Sector', 'Score', 'Tier', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-4 py-2.5 text-left text-[10px] text-slate-500 font-medium uppercase tracking-widest">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-16 text-slate-500">
                  <div className="flex flex-col items-center gap-2">
                    <svg className="animate-spin w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="40" strokeDashoffset="10" />
                    </svg>
                    <span className="text-[11px] text-slate-400">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <EmptyState title="No leads found" description="Try adjusting your filters or add a new lead." />
                </td>
              </tr>
            ) : (
              leads.map(lead => (
                <tr
                  key={lead.id}
                  className="border-b border-slate-100 hover:bg-indigo-50/50 transition-colors group"
                >
                  <td className="px-4 py-2.5 font-medium text-slate-900 whitespace-nowrap">
                    {lead.nom}
                  </td>
                  <td className="px-4 py-2.5 text-slate-500 whitespace-nowrap">
                    {lead.entreprise || <span className="text-slate-400">—</span>}
                  </td>
                  <td className="px-4 py-2.5 text-slate-500 whitespace-nowrap">
                    {lead.secteur || <span className="text-slate-400">—</span>}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`font-mono font-semibold tabular-nums ${getScoreColor(lead.score ?? 0, lead.categorie)}`}>
                      {lead.score != null ? lead.score.toFixed(1) : <span className="text-slate-400">—</span>}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    {lead.categorie ? (
                      <TierBadge categorie={lead.categorie} />
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    <StatusBadge
                      statut={lead.statut}
                      onChange={statut => updateStatut(lead.id, statut)}
                      statuts={STATUTS}
                    />
                  </td>
                  <td className="px-4 py-2.5">
                    <ActionMenu leadId={lead.id} onDelete={handleDelete} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {total > 0 && (
        <div className="px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 tabular-nums font-mono">
            {from}–{to} of {total}
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-2.5 py-1 border border-slate-200 rounded text-xs text-slate-500 hover:text-slate-700 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ← Prev
            </button>
            <span className="px-2.5 py-1 text-xs text-slate-500 tabular-nums font-mono">
              {page}
            </span>
            <button
              disabled={page * LIMIT >= total}
              onClick={() => setPage(page + 1)}
              className="px-2.5 py-1 border border-slate-200 rounded text-xs text-slate-500 hover:text-slate-700 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

