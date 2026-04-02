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
      <div className="flex h-16 shrink-0 items-center px-5 border-b border-slate-100">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-violet-800 text-white shadow-sm shadow-violet-200">
            <Zap size={15} className="text-white" />
          </div>
          <div>
            <span className="text-sm font-bold tracking-tight text-slate-900">LeadBot</span>
            <span className="block text-[10px] text-slate-400 font-medium leading-none mt-0.5">B2B Prospection</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-0.5">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-3 mb-2">Menu</p>
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group relative",
                isActive
                  ? "bg-violet-50 text-violet-800"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-violet-600 rounded-r-full" />
              )}
              <item.icon size={16} className={cn(
                "transition-colors shrink-0",
                isActive ? "text-violet-600" : "text-slate-400 group-hover:text-slate-600"
              )} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Area */}
      <div className="p-3 border-t border-slate-100">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center text-[11px] font-semibold text-white shrink-0 shadow-sm">
            {getInitials(user?.name || user?.email)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-900 truncate leading-tight">{user?.name || 'User'}</p>
            <p className="text-[10px] text-slate-400 truncate leading-tight mt-0.5">{user?.email || 'Pro Plan'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1 rounded-md hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
            title="Sign out"
          >
            <LogOut size={13} className="text-slate-400 hover:text-red-500 transition-colors" />
          </button>
        </div>
      </div>
    </aside>
  );
}
