'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function HomePage() {
  const [view, setView] = useState<'week' | 'month'>('week');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-semibold">
              LB
            </span>
            <span className="text-sm font-semibold tracking-tight text-slate-900">
              LeadBot
            </span>
          </div>
          <nav className="flex items-center gap-4 text-[11px] text-slate-500">
            <span className="hidden md:inline cursor-default">Produit</span>
            <span className="hidden md:inline cursor-default">Clients</span>
            <span className="hidden md:inline cursor-default">Ressources</span>
            <Link
              href="/login"
              className="px-3 py-1.5 rounded-full border border-slate-200 hover:border-indigo-500 text-slate-800 text-[11px] font-medium bg-white hover:bg-indigo-50 transition-colors"
            >
              Se connecter
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="bg-gradient-to-br from-indigo-50 via-slate-50 to-emerald-50">
          <div className="max-w-5xl mx-auto px-4 py-10 md:py-16 grid grid-cols-1 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-10 items-center">
            {/* Colonne texte */}
            <div>
              <p className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-[11px] text-slate-500 mb-4 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                CRM de prospection simple pour équipes B2B
              </p>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 mb-3">
                Suis tes leads et tes réponses dans un seul écran clair.
              </h1>
              <p className="text-sm text-slate-600 mb-6 max-w-xl">
                LeadBot t&apos;affiche une vue nette de ta prospection : qui a été contacté, qui a répondu, et sur
                quels deals tu dois te concentrer aujourd&apos;hui.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-700 text-xs font-medium px-5 py-2.5 text-white shadow-sm transition-colors"
                >
                  Accéder à l&apos;espace
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white hover:border-slate-300 text-xs font-medium px-5 py-2.5 text-slate-700 transition-colors"
                >
                  Voir le dashboard de démo
                </Link>
              </div>
              <p className="mt-4 text-[11px] text-slate-500">
                100% démo pour l&apos;instant • Idéal pour montrer ton projet en entretien / démo client
              </p>
            </div>

            {/* Colonne aperçu visuel */}
            <div className="hidden md:block">
              <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)] overflow-hidden transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/80">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="font-medium text-slate-700">Pipeline Leads</span>
                  </div>
                  <div className="inline-flex items-center gap-1 rounded-full bg-white border border-slate-200 p-0.5 text-[10px] text-slate-500">
                    <button
                      type="button"
                      onClick={() => setView('week')}
                      className={`px-2 py-0.5 rounded-full transition-colors ${
                        view === 'week' ? 'bg-slate-900 text-white' : 'hover:bg-slate-100'
                      }`}
                    >
                      Semaine
                    </button>
                    <button
                      type="button"
                      onClick={() => setView('month')}
                      className={`px-2 py-0.5 rounded-full transition-colors ${
                        view === 'month' ? 'bg-slate-900 text-white' : 'hover:bg-slate-100'
                      }`}
                    >
                      Mois
                    </button>
                  </div>
                </div>
                <div className="px-4 pt-3 pb-4 space-y-3 text-xs">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                      <p className="text-[11px] text-slate-500 mb-1">Nouveaux leads</p>
                      <p className="text-lg font-semibold tabular-nums text-slate-900">
                        {view === 'week' ? '32' : '128'}
                      </p>
                      <p className="text-[10px] text-emerald-600 mt-0.5">
                        {view === 'week' ? '+12 cette semaine' : '+48 ce mois-ci'}
                      </p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                      <p className="text-[11px] text-slate-500 mb-1">Taux de réponse</p>
                      <p className="text-lg font-semibold tabular-nums text-slate-900">
                        {view === 'week' ? '18,4%' : '21,2%'}
                      </p>
                      <p className="text-[10px] text-emerald-600 mt-0.5">
                        {view === 'week' ? '+3,1 pts' : '+5,4 pts'}
                      </p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                      <p className="text-[11px] text-slate-500 mb-1">Deals gagnés</p>
                      <p className="text-lg font-semibold tabular-nums text-slate-900">
                        {view === 'week' ? '7' : '21'}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {view === 'week' ? 'sur cette semaine' : 'sur ce mois'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] text-slate-500">Leads par statut</span>
                      <span className="text-[11px] text-slate-400">
                        {view === 'week' ? "Aujourd'hui" : 'Ce mois'}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[11px] text-slate-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          CHAUD
                        </span>
                        <span className="text-slate-700 font-mono text-[11px]">
                          {view === 'week' ? '11' : '38'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[11px] text-slate-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                          TIEDE
                        </span>
                        <span className="text-slate-700 font-mono text-[11px]">
                          {view === 'week' ? '19' : '64'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[11px] text-slate-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          FROID
                        </span>
                        <span className="text-slate-700 font-mono text-[11px]">
                          {view === 'week' ? '42' : '133'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>
                      {view === 'week'
                        ? "3 tâches à traiter aujourd'hui"
                        : '12 tâches à prévoir cette semaine'}
                    </span>
                    <span className="text-emerald-600 font-medium">Voir dans Leads →</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

