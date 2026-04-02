"use client";

import { Badge } from '../../../components/ui/Badge';
import { Users, Zap, CheckCircle2, MoreHorizontal, ArrowUpRight, TrendingUp, LayoutDashboard } from 'lucide-react';

const kpis = [
  {
    label: 'Nouveaux leads',
    value: '128',
    trend: '+24%',
    sub: 'vs. last week',
    icon: Users,
    accent: 'bg-violet-500',
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    trendColor: 'text-violet-600 bg-violet-50',
  },
  {
    label: 'Campagnes actives',
    value: '4',
    trend: null,
    sub: 'Bot en cours',
    icon: Zap,
    accent: 'bg-fuchsia-500',
    iconBg: 'bg-fuchsia-50',
    iconColor: 'text-fuchsia-600',
    trendColor: '',
  },
  {
    label: 'Taux de réponse',
    value: '18.4%',
    trend: '+3.1%',
    sub: 'vs. période précédente',
    icon: ArrowUpRight,
    accent: 'bg-blue-500',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    trendColor: 'text-blue-600 bg-blue-50',
  },
  {
    label: 'Deals gagnés',
    value: '12',
    trend: null,
    sub: 'Basé sur les statuts',
    icon: CheckCircle2,
    accent: 'bg-emerald-500',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    trendColor: '',
  },
];

export default function DashboardPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LayoutDashboard size={14} className="text-slate-400" />
            <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Overview</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">Vue d'ensemble de ta prospection.</p>
        </div>
        <select className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent cursor-pointer transition-all">
          <option>7 derniers jours</option>
          <option>30 derniers jours</option>
          <option>Cette semaine</option>
          <option>Ce mois</option>
        </select>
      </header>

      {/* KPI Cards */}
      <section className="grid grid-cols-4 gap-4 mb-8">
        {kpis.map(kpi => (
          <div key={kpi.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${kpi.accent} rounded-l-xl`} />
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-medium text-slate-500">{kpi.label}</p>
              <div className={`p-1.5 rounded-lg ${kpi.iconBg}`}>
                <kpi.icon size={14} className={kpi.iconColor} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-slate-900 tabular-nums">{kpi.value}</p>
              {kpi.trend && (
                <span className={`flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${kpi.trendColor}`}>
                  <TrendingUp size={10} />
                  {kpi.trend}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">{kpi.sub}</p>
          </div>
        ))}
      </section>

      {/* Main Content */}
      <section className="grid grid-cols-3 gap-6">
        {/* Activity */}
        <div className="col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-semibold text-slate-900">Activité récente</h2>
            <button className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
              <MoreHorizontal size={16} />
            </button>
          </div>
          <div className="space-y-5">
            <div className="flex gap-4">
              <div className="relative mt-1 shrink-0">
                <div className="absolute left-1/2 top-5 bottom-0 -translate-x-1/2 w-px bg-slate-100" />
                <div className="relative z-10 w-2.5 h-2.5 rounded-full bg-violet-500 ring-4 ring-violet-50" />
              </div>
              <div className="pb-5">
                <p className="text-sm text-slate-900">
                  8 nouveaux leads{' '}
                  <Badge variant="hot" className="ml-1 scale-90 origin-left">Tier A</Badge>
                </p>
                <p className="text-xs text-slate-400 mt-1">Importés depuis Hunter.io · Il y a 2h</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="relative mt-1 shrink-0">
                <div className="absolute left-1/2 top-5 bottom-0 -translate-x-1/2 w-px bg-slate-100" />
                <div className="relative z-10 w-2.5 h-2.5 rounded-full bg-blue-400 ring-4 ring-blue-50" />
              </div>
              <div className="pb-5">
                <p className="text-sm text-slate-900">2 campagnes email ont été lancées.</p>
                <p className="text-xs text-slate-400 mt-1">Séquence SaaS CTO · Il y a 5h</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="relative mt-1 shrink-0">
                <div className="relative z-10 w-2.5 h-2.5 rounded-full bg-slate-300 ring-4 ring-slate-50" />
              </div>
              <div>
                <p className="text-sm text-slate-900">
                  5 leads marqués comme{' '}
                  <Badge variant="cold" className="ml-1 scale-90 origin-left">Converted</Badge>
                </p>
                <p className="text-xs text-slate-400 mt-1">Par Nadia Benzaoui · Hier</p>
              </div>
            </div>
          </div>
        </div>

        {/* Today's tasks */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-slate-900 mb-5">À traiter aujourd'hui</h2>
          <div className="space-y-3">
            {[
              { title: 'Relancer 12 leads', desc: "Tier B sans réponse depuis 4 jours.", dot: 'bg-orange-400' },
              { title: 'Vérifier bounces', desc: 'Dernière campagne : 3 adresses erronées.', dot: 'bg-red-400' },
              { title: 'Nouvelle séquence', desc: 'Configurer les emails pour les CTO SaaS.', dot: 'bg-slate-300' },
            ].map((task) => (
              <div
                key={task.title}
                className="flex flex-col p-3 rounded-lg border border-slate-100 hover:bg-violet-50/30 hover:border-violet-100 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-900 group-hover:text-violet-900 transition-colors">{task.title}</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${task.dot}`} />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{task.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
