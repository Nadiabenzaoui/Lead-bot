import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import LeadsPage from './pages/LeadsPage';
import MonitorPage from './pages/MonitorPage';
import BotPage from './pages/BotPage';
import SendPage from './pages/SendPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastProvider } from './components/ui/Toast';

interface NavItem {
  to: string;
  label: string;
  end?: boolean;
  icon: React.ReactElement;
}

function IconLeads(): React.ReactElement {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconMonitor(): React.ReactElement {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

function IconBot(): React.ReactElement {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4" />
      <line x1="8" y1="16" x2="8" y2="16" />
      <line x1="16" y1="16" x2="16" y2="16" />
    </svg>
  );
}

function IconSend(): React.ReactElement {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

const nav: NavItem[] = [
  { to: '/', label: 'Leads', end: true, icon: <IconLeads /> },
  { to: '/monitor', label: 'Analytics', icon: <IconMonitor /> },
  { to: '/bot', label: 'Bot Engine', icon: <IconBot /> },
  { to: '/send', label: 'Messages', icon: <IconSend /> },
];

export default function App(): React.ReactElement {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex bg-zinc-950 text-zinc-100">
        {/* Left Sidebar */}
        <aside className="w-48 fixed top-0 left-0 h-screen flex flex-col border-r border-zinc-800/80 bg-zinc-950 z-10">
          {/* Brand */}
          <div className="px-4 py-4 flex items-center gap-2 border-b border-zinc-800/80">
            <span className="text-indigo-400 text-base leading-none">●</span>
            <span
              className="text-xs font-semibold tracking-widest text-zinc-200 uppercase"
              style={{ fontVariant: 'small-caps', letterSpacing: '0.12em' }}
            >
              LeadBot
            </span>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-2 py-3 space-y-px">
            {nav.map(({ to, label, end, icon }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }: { isActive: boolean }) =>
                  `relative flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? 'text-white'
                      : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40'
                  }`
                }
              >
                {({ isActive }: { isActive: boolean }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-indigo-500 rounded-r-full" />
                    )}
                    <span className={isActive ? 'text-zinc-300' : 'text-zinc-600'}>{icon}</span>
                    {label}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-zinc-800/80">
            <p className="text-[10px] text-zinc-700 font-mono">v1.0</p>
          </div>
        </aside>

        {/* Main content */}
        <main className="ml-48 flex-1 min-h-screen bg-zinc-950">
          <ToastProvider>
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<LeadsPage />} />
                <Route path="/monitor" element={<MonitorPage />} />
                <Route path="/bot" element={<BotPage />} />
                <Route path="/send" element={<SendPage />} />
              </Routes>
            </ErrorBoundary>
          </ToastProvider>
        </main>
      </div>
    </BrowserRouter>
  );
}
