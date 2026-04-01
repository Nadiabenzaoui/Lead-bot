import Link from 'next/link';

const nav = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/leads', label: 'Leads' },
  { href: '/monitor', label: 'Analytics' },
  { href: '/bot', label: 'Bot Engine' },
  { href: '/send', label: 'Messages' }
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex bg-zinc-950 text-zinc-100">
      <aside className="w-52 fixed top-0 left-0 h-screen flex flex-col border-r border-zinc-800/80 bg-zinc-950/95 backdrop-blur z-10">
        <div className="px-4 py-4 flex items-center gap-2 border-b border-zinc-800/80">
          <span className="text-indigo-400 text-base leading-none">●</span>
          <span
            className="text-xs font-semibold tracking-widest text-zinc-200 uppercase"
            style={{ fontVariant: 'small-caps', letterSpacing: '0.12em' }}
          >
            LeadBot
          </span>
        </div>
        <nav className="flex-1 px-2 py-3 space-y-px">
          {nav.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-4 py-3 border-t border-zinc-800/80">
          <p className="text-[10px] text-zinc-700 font-mono">v1.0 • demo</p>
        </div>
      </aside>
      <main className="ml-52 flex-1 min-h-screen bg-zinc-950">
        <header className="px-6 py-4 border-b border-zinc-800/80 flex items-center justify-between">
          <div>
            <h1 className="text-sm font-semibold text-zinc-100 tracking-tight">Dashboard</h1>
            <p className="text-[11px] text-zinc-500 mt-1">Vue d&apos;ensemble de ta prospection.</p>
          </div>
          <div className="flex items-center gap-2">
            <select className="px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-md text-[11px] text-zinc-400 focus:outline-none focus:border-zinc-600">
              <option>7 derniers jours</option>
              <option>30 derniers jours</option>
              <option>Cette semaine</option>
              <option>Ce mois</option>
            </select>
          </div>
        </header>
        <div className="p-6 space-y-6">
          <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3">
              <p className="text-[11px] text-zinc-500 mb-1">Nouveaux leads</p>
              <p className="text-2xl font-bold text-zinc-100 tabular-nums">128</p>
              <p className="text-[10px] text-emerald-400 mt-1">+24% vs. semaine dernière</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3">
              <p className="text-[11px] text-zinc-500 mb-1">Campagnes actives</p>
              <p className="text-2xl font-bold text-zinc-100 tabular-nums">4</p>
              <p className="text-[10px] text-zinc-500 mt-1">Bot en cours d&apos;exécution</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3">
              <p className="text-[11px] text-zinc-500 mb-1">Taux de réponse</p>
              <p className="text-2xl font-bold text-zinc-100 tabular-nums">18.4%</p>
              <p className="text-[10px] text-emerald-400 mt-1">+3.1 pts vs. période précédente</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3">
              <p className="text-[11px] text-zinc-500 mb-1">Deals gagnés</p>
              <p className="text-2xl font-bold text-zinc-100 tabular-nums">12</p>
              <p className="text-[10px] text-zinc-500 mt-1">Basé sur les statuts des leads</p>
            </div>
          </section>
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-semibold text-zinc-200">Activité récente</h2>
                <span className="text-[10px] text-zinc-500">Dernières 24h</span>
              </div>
              <div className="space-y-2 text-[11px] text-zinc-400">
                <p>• 8 nouveaux leads &quot;CHAUD&quot; importés depuis LinkedIn.</p>
                <p>• 2 campagnes email ont été lancées.</p>
                <p>• 5 leads ont été marqués comme &quot;CONVERTI&quot;.</p>
              </div>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
              <h2 className="text-xs font-semibold text-zinc-200 mb-3">À traiter aujourd&apos;hui</h2>
              <ul className="space-y-2 text-[11px] text-zinc-400">
                <li>• Relancer 12 leads &quot;TIEDE&quot; sans réponse.</li>
                <li>• Vérifier les bounces email de la dernière campagne.</li>
                <li>• Configurer une nouvelle séquence pour les CTO SaaS.</li>
              </ul>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

