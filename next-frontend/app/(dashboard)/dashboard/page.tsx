"use client";

import { useEffect, useState } from 'react';
import { Badge } from '../../../components/ui/Badge';
import { Users, MessageSquare, CheckCircle2, MoreHorizontal, TrendingUp, LayoutDashboard, Reply } from 'lucide-react';
import api from '../../../utils/api';

interface DashboardData {
  totalLeads: number;
  totalMessages: number;
  replyRate: number;
  dealsWon: number;
  recentLeads: { nom: string; score: number; categorie: string; createdAt: string }[];
}

const TIER_COLORS: Record<string, string> = {
  CHAUD: 'bg-violet-500',
  TIEDE: 'bg-fuchsia-400',
  FROID: 'bg-slate-300',
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/monitor'),
      api.get('/leads?statut=CONVERTI&limit=1'),
    ]).then(([monitorRes, convertedRes]) => {
      setData({
        totalLeads: monitorRes.data.totalLeads,
        totalMessages: monitorRes.data.totalMessages,
        replyRate: monitorRes.data.replyRate,
        dealsWon: convertedRes.data.total,
        recentLeads: monitorRes.data.recentLeads,
      });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const kpis = data ? [
    {
      label: 'Total leads',
      value: data.totalLeads,
      sub: 'En base de données',
      icon: Users,
      accent: 'bg-violet-500',
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-600',
    },
    {
      label: 'Messages envoyés',
      value: data.totalMessages,
      sub: 'Tous canaux',
      icon: MessageSquare,
      accent: 'bg-blue-500',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Taux de réponse',
      value: `${data.replyRate}%`,
      sub: 'Réponses reçues',
      icon: Reply,
      accent: 'bg-fuchsia-500',
      iconBg: 'bg-fuchsia-50',
      iconColor: 'text-fuchsia-600',
    },
    {
      label: 'Deals gagnés',
      value: data.dealsWon,
      sub: 'Leads convertis',
      icon: CheckCircle2,
      accent: 'bg-emerald-500',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
  ] : [];

  return (
    <div className="p-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LayoutDashboard size={14} className="text-slate-400" />
            <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Overview</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">Vue d'ensemble de ta prospection.</p>
        </div>
      </header>

      {/* KPI Cards */}
      <section className="grid grid-cols-4 gap-4 mb-8">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 animate-pulse">
              <div className="h-3 bg-slate-100 rounded w-2/3 mb-4" />
              <div className="h-8 bg-slate-100 rounded w-1/2 mb-2" />
              <div className="h-2.5 bg-slate-100 rounded w-1/3" />
            </div>
          ))
        ) : (
          kpis.map(kpi => (
            <div key={kpi.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 relative overflow-hidden hover:shadow-md transition-shadow">
              <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${kpi.accent} rounded-l-xl`} />
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs font-medium text-slate-500">{kpi.label}</p>
                <div className={`p-1.5 rounded-lg ${kpi.iconBg}`}>
                  <kpi.icon size={14} className={kpi.iconColor} />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900 tabular-nums">{kpi.value}</p>
              <p className="text-[11px] text-slate-400 mt-1">{kpi.sub}</p>
            </div>
          ))
        )}
      </section>

      {/* Main Content */}
      <section className="grid grid-cols-3 gap-6">
        {/* Recent leads */}
        <div className="col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-semibold text-slate-900">Leads récents</h2>
            <a href="/leads" className="text-xs text-violet-600 hover:text-violet-800 font-medium transition-colors">
              Voir tous →
            </a>
          </div>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-4 animate-pulse">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-100 mt-1 shrink-0" />
                  <div className="flex-1">
                    <div className="h-3 bg-slate-100 rounded w-1/2 mb-2" />
                    <div className="h-2.5 bg-slate-100 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : data?.recentLeads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <Users size={20} className="text-slate-200" />
              <p className="text-xs text-slate-400">Aucun lead pour l'instant. Lance le bot pour commencer.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {data?.recentLeads.map((lead, i) => (
                <div key={i} className="flex gap-4">
                  <div className="relative mt-1 shrink-0">
                    {i < (data.recentLeads.length - 1) && (
                      <div className="absolute left-1/2 top-4 bottom-0 -translate-x-1/2 w-px bg-slate-100" />
                    )}
                    <div className={`relative z-10 w-2.5 h-2.5 rounded-full ring-4 ring-white ${TIER_COLORS[lead.categorie] || 'bg-slate-300'}`} />
                  </div>
                  <div className="pb-5">
                    <p className="text-sm text-slate-900 font-medium">
                      {lead.nom}
                      {lead.categorie === 'CHAUD' && (
                        <Badge variant="hot" className="ml-2 scale-90 origin-left">Tier A</Badge>
                      )}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Score: <span className="font-medium text-violet-600">{lead.score?.toFixed(1)}</span>
                      {' · '}
                      {new Date(lead.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick stats */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-slate-900 mb-5">Répartition des tiers</h2>
          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[1,2,3].map(i => (
                <div key={i}>
                  <div className="h-2.5 bg-slate-100 rounded w-1/2 mb-2" />
                  <div className="h-1.5 bg-slate-100 rounded-full" />
                </div>
              ))}
            </div>
          ) : (
            <TierBreakdown totalLeads={data?.totalLeads ?? 0} />
          )}
        </div>
      </section>
    </div>
  );
}

function TierBreakdown({ totalLeads }: { totalLeads: number }) {
  const [byCategorie, setByCategorie] = useState<{ categorie: string; _count: number }[]>([]);

  useEffect(() => {
    api.get('/monitor').then(r => setByCategorie(r.data.byCategorie)).catch(() => {});
  }, []);

  const total = totalLeads || 1;

  const tiers = [
    { key: 'CHAUD', label: 'Tier A', bar: 'bg-violet-500', text: 'text-violet-700' },
    { key: 'TIEDE', label: 'Tier B', bar: 'bg-fuchsia-400', text: 'text-fuchsia-600' },
    { key: 'FROID', label: 'Tier C', bar: 'bg-slate-300', text: 'text-slate-500' },
  ];

  if (totalLeads === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 gap-2">
        <TrendingUp size={20} className="text-slate-200" />
        <p className="text-xs text-slate-400">Pas encore de leads.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {tiers.map(tier => {
        const item = byCategorie.find(b => b.categorie === tier.key);
        const count = item?._count ?? 0;
        const pct = Math.round((count / total) * 100);
        return (
          <div key={tier.key}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-medium ${tier.text}`}>{tier.label}</span>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-900 tabular-nums">{count}</span>
                <span className="text-[10px] text-slate-400">({pct}%)</span>
              </div>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full ${tier.bar} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
