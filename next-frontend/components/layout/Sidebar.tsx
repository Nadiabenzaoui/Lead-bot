'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, Activity, Bot, Send, Zap, LogOut } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useEffect, useState } from 'react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/leads', label: 'Leads Pipeline', icon: Users },
  { href: '/bot', label: 'Bot Engine', icon: Bot },
  { href: '/send', label: 'Campaigns', icon: Send },
  { href: '/monitor', label: 'Analytics', icon: Activity }
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{name?: string, email?: string} | null>(null);

  useEffect(() => {
    const rawUser = localStorage.getItem('leadbot_user');
    if (rawUser) {
      try {
        setUser(JSON.parse(rawUser));
      } catch (e) {}
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('leadbot_token');
    localStorage.removeItem('leadbot_user');
    router.push('/login');
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-slate-200 bg-white">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-800 text-white font-bold shadow-sm">
            <Zap size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            LeadBot
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                isActive 
                  ? "bg-indigo-50/80 text-violet-800 shadow-sm ring-1 ring-indigo-100" 
                  : "text-slate-500 hover:text-violet-700 hover:bg-indigo-50/50"
              )}
            >
              <item.icon size={18} className={cn("transition-colors", isActive ? "text-violet-700" : "text-slate-400 group-hover:text-violet-600")} />
              {item.label}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-600 shadow-sm" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Area */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group border border-transparent hover:border-slate-200">
          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-medium text-slate-600 border border-slate-200">
            {getInitials(user?.name || user?.email)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email || 'Pro Plan'}</p>
          </div>
          <button onClick={handleLogout} className="p-1 rounded hover:bg-slate-200 transition-colors">
            <LogOut size={16} className="text-slate-400 hover:text-red-500 transition-colors" />
          </button>
        </div>
      </div>
    </aside>
  );
}
