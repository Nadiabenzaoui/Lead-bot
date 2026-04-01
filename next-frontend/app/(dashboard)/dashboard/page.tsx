"use client";

import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Users, Zap, CheckCircle2, MoreHorizontal, ArrowUpRight, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Vue d'ensemble de ta prospection.</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent cursor-pointer">
            <option>7 derniers jours</option>
            <option>30 derniers jours</option>
            <option>Cette semaine</option>
            <option>Ce mois</option>
          </select>
        </div>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-slate-500">Nouveaux leads</p>
            <div className="p-2 bg-violet-50 rounded-lg">
              <Users size={16} className="text-violet-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-slate-900">128</p>
            <span className="flex items-center text-xs font-medium text-violet-600">
              <TrendingUp size={12} className="mr-1" />
              +24%
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">vs. semaine dernière</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-slate-500">Campagnes actives</p>
            <div className="p-2 bg-fuchsia-50 rounded-lg">
              <Zap size={16} className="text-fuchsia-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-slate-900">4</p>
          </div>
          <p className="text-xs text-slate-500 mt-1">Bot en cours d'exécution</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-slate-500">Taux de réponse</p>
            <div className="p-2 bg-indigo-50/80 rounded-lg">
              <ArrowUpRight size={16} className="text-indigo-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-slate-900">18.4%</p>
            <span className="flex items-center text-xs font-medium text-violet-600">
              <TrendingUp size={12} className="mr-1" />
              +3.1%
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">vs. période précédente</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-slate-500">Deals gagnés</p>
            <div className="p-2 bg-purple-100/50 rounded-lg">
              <CheckCircle2 size={16} className="text-purple-700" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-slate-900">12</p>
          </div>
          <p className="text-xs text-slate-500 mt-1">Basé sur les statuts des leads</p>
        </Card>
      </section>

      {/* Main Content */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-semibold text-slate-900">Activité récente</h2>
            <button className="text-slate-400 hover:text-slate-600 transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="relative mt-1">
                <div className="absolute inset-x-0 top-6 -bottom-6 w-px bg-slate-200 left-1/2 -translate-x-1/2"></div>
                <div className="relative z-10 w-2.5 h-2.5 rounded-full bg-violet-500 ring-4 ring-white"></div>
              </div>
              <div>
                <p className="text-sm text-slate-900">8 nouveaux leads <Badge variant="hot" className="ml-1 scale-90 origin-left">CHAUD</Badge></p>
                <p className="text-xs text-slate-500 mt-1">Importés depuis LinkedIn • Il y a 2h</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="relative mt-1">
                <div className="absolute inset-x-0 top-6 -bottom-6 w-px bg-slate-200 left-1/2 -translate-x-1/2"></div>
                <div className="relative z-10 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-white"></div>
              </div>
              <div>
                <p className="text-sm text-slate-900">2 campagnes email ont été lancées.</p>
                <p className="text-xs text-slate-500 mt-1">Séquence SaaS CTO • Il y a 5h</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="relative mt-1">
                <div className="relative z-10 w-2.5 h-2.5 rounded-full bg-slate-300 ring-4 ring-white"></div>
              </div>
              <div>
                <p className="text-sm text-slate-900">5 leads marqués comme <Badge variant="cold" className="ml-1 scale-90 origin-left">CONVERTI</Badge></p>
                <p className="text-xs text-slate-500 mt-1">Par Nadia Benzaoui • Hier</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-base font-semibold text-slate-900 mb-6">À traiter aujourd'hui</h2>
          <div className="space-y-4">
            <div className="group flex flex-col p-3 rounded-lg border border-slate-100 bg-slate-50 hover:bg-indigo-50/50 hover:border-indigo-100 hover:shadow-sm transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-slate-900">Relancer 12 leads</span>
                <span className="w-2 h-2 rounded-full bg-orange-400"></span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1">Leads 'TIEDE' n'ayant pas répondu depuis 4 jours.</p>
            </div>
            <div className="group flex flex-col p-3 rounded-lg border border-slate-100 bg-slate-50 hover:bg-indigo-50/50 hover:border-indigo-100 hover:shadow-sm transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-slate-900">Vérifier bounces</span>
                <span className="w-2 h-2 rounded-full bg-red-400"></span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1">Dernière campagne : 3 adresses erronées.</p>
            </div>
            <div className="group flex flex-col p-3 rounded-lg border border-slate-100 bg-slate-50 hover:bg-indigo-50/50 hover:border-indigo-100 hover:shadow-sm transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-slate-900">Nouvelle séquence</span>
                <span className="w-2 h-2 rounded-full bg-slate-300"></span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1">Configurer les emails pour les CTO SaaS.</p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
