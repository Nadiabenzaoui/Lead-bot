import Link from 'next/link';
import LeadsContent from './LeadsContent';

const nav = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/leads', label: 'Leads' },
  { href: '/monitor', label: 'Analytics' },
  { href: '/bot', label: 'Bot Engine' },
  { href: '/send', label: 'Messages' }
];

export default function LeadsPage() {
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
        <LeadsContent />
      </main>
    </div>
  );
}

