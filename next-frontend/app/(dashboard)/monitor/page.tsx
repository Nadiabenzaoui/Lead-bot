"use client";

import { useMonitor } from '../../../hooks/useMonitor';
import { Users, MessageSquare, MailOpen, MousePointer, Reply, TrendingUp, BarChart2 } from 'lucide-react';
import { TIER_LABELS, TIER_BAR_COLORS, TIER_BAR_TEXT, CANAL_LABELS, CANAL_BAR_COLORS, CANAL_TEXT_COLORS } from '../../../constants';

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  accent: string;
  iconBg: string;
  iconColor: string;
}

function StatCard({ icon: Icon, label, value, sub, accent, iconBg, iconColor }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm overflow-hidden relative hover:shadow-md transition-shadow">
      <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${accent} rounded-l-xl`} />
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <div className={`p-1.5 rounded-lg ${iconBg}`}>
          <Icon size={14} className={iconColor} />
        </div>
      </div>
      <p className="text-3xl font-bold text-slate-900 tabular-nums">{value}</p>
      {sub && <p className="text-[11px] text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <p className="text-sm font-medium text-red-700">Erreur de chargement</p>
      <p className="text-xs text-red-500 mt-1">{message}</p>
    </div>
  );
}

export default function MonitorPage() {
  const { stats, loading, error } = useMonitor();

  const totalByCategorie = stats?.byCategorie.reduce((s, c) => s + c._count, 0) || 1;
  const totalByCanal = stats?.byCanal.reduce((s, c) => s + c._count, 0) || 1;

  return (
    <div className="p-8 max-w-6xl">
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <BarChart2 size={14} className="text-slate-400" />
          <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Reporting</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">Track your outreach performance and lead quality.</p>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <svg className="animate-spin w-5 h-5 text-slate-300" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="40" strokeDashoffset="10" />
          </svg>
        </div>
      ) : error ? (
        <ErrorState message={error} />
      ) : stats ? (
        <>
          <div className="grid grid-cols-5 gap-4 mb-8">
            <StatCard icon={Users} label="Total Leads" value={stats.totalLeads} sub="In database" accent="bg-violet-500" iconBg="bg-violet-50" iconColor="text-violet-600" />
            <StatCard icon={MessageSquare} label="Messages Sent" value={stats.totalMessages} sub="All channels" accent="bg-blue-500" iconBg="bg-blue-50" iconColor="text-blue-600" />
            <StatCard icon={MailOpen} label="Open Rate" value={`${stats.openRate}%`} sub="Emails opened" accent="bg-amber-500" iconBg="bg-amber-50" iconColor="text-amber-600" />
            <StatCard icon={MousePointer} label="Click Rate" value={`${stats.clickRate}%`} sub="Links clicked" accent="bg-emerald-500" iconBg="bg-emerald-50" iconColor="text-emerald-600" />
            <StatCard icon={Reply} label="Reply Rate" value={`${stats.replyRate}%`} sub="Responses received" accent="bg-cyan-500" iconBg="bg-cyan-50" iconColor="text-cyan-600" />
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900 mb-5">Leads by Tier</h2>
              <div className="space-y-5">
                {(['CHAUD', 'TIEDE', 'FROID'] as const).map(cat => {
                  const item = stats.byCategorie.find(b => b.categorie === cat);
                  const count = item?._count ?? 0;
                  const pct = Math.round((count / totalByCategorie) * 100);
                  return (
                    <div key={cat}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${TIER_BAR_COLORS[cat]}`} />
                          <span className={`text-xs font-medium ${TIER_BAR_TEXT[cat]}`}>{TIER_LABELS[cat]}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-slate-900 tabular-nums">{count}</span>
                          <span className="text-[10px] text-slate-400 tabular-nums">({pct}%)</span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${TIER_BAR_COLORS[cat]} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900 mb-5">Messages by Channel</h2>
              {stats.totalMessages === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 gap-2">
                  <MessageSquare size={20} className="text-slate-200" />
                  <p className="text-xs text-slate-400">No messages sent yet.</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {stats.byCanal.map(({ canal, _count }) => {
                    const pct = Math.round((_count / totalByCanal) * 100);
                    return (
                      <div key={canal}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-xs font-medium ${CANAL_TEXT_COLORS[canal as keyof typeof CANAL_TEXT_COLORS] ?? 'text-slate-500'}`}>{CANAL_LABELS[canal as keyof typeof CANAL_LABELS] ?? canal}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-slate-900 tabular-nums">{_count}</span>
                            <span className="text-[10px] text-slate-400 tabular-nums">({pct}%)</span>
                          </div>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${CANAL_BAR_COLORS[canal as keyof typeof CANAL_BAR_COLORS] ?? 'bg-slate-400'} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900 mb-5">Recent Leads</h2>
              <div className="space-y-3">
                {stats.recentLeads.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 gap-2">
                    <Users size={20} className="text-slate-200" />
                    <p className="text-xs text-slate-400">No leads yet.</p>
                  </div>
                ) : stats.recentLeads.map((lead, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                    <div>
                      <p className="text-xs font-medium text-slate-900">{lead.nom}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-violet-600 tabular-nums">{lead.score.toFixed(1)}</span>
                      <span className={`w-1.5 h-1.5 rounded-full ${TIER_BAR_COLORS[lead.categorie as keyof typeof TIER_BAR_COLORS] ?? 'bg-slate-300'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {stats.totalMessages > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mt-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-semibold text-slate-900">Email Funnel</h2>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <TrendingUp size={11} />
                  <span>Performance overview</span>
                </div>
              </div>
              <div className="flex items-end gap-3">
                {[
                  { label: 'Sent', value: 100, color: 'bg-slate-200', textColor: 'text-slate-500' },
                  { label: 'Opened', value: stats.openRate, color: 'bg-violet-500', textColor: 'text-violet-600' },
                  { label: 'Clicked', value: stats.clickRate, color: 'bg-blue-500', textColor: 'text-blue-600' },
                  { label: 'Replied', value: stats.replyRate, color: 'bg-emerald-500', textColor: 'text-emerald-600' },
                ].map((bar, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 flex-1">
                    <span className={`text-xs font-semibold tabular-nums ${bar.textColor}`}>{bar.value}%</span>
                    <div className="w-full bg-slate-100 rounded-md overflow-hidden" style={{ height: `${Math.max(bar.value * 0.9, 8)}px` }}>
                      <div className={`w-full h-full ${bar.color} rounded-md`} />
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{bar.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
