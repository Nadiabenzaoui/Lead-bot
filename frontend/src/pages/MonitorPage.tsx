import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { useMonitor } from '../hooks/useMonitor';
import { TierBadge } from '../components/ui/Badge';

interface ChartDataPoint {
  name: string;
  value: number;
}

// Static sparkline data for "leads over time"
const LEADS_OVER_TIME: { day: string; leads: number }[] = [
  { day: 'Mon', leads: 12 },
  { day: 'Tue', leads: 19 },
  { day: 'Wed', leads: 8 },
  { day: 'Thu', leads: 27 },
  { day: 'Fri', leads: 34 },
  { day: 'Sat', leads: 15 },
  { day: 'Sun', leads: 22 },
];

interface StatCardProps {
  label: string;
  value: number | string;
  unit?: string;
  trend?: string;
}

function StatCard({ label, value, unit = '', trend }: StatCardProps): React.ReactElement {
  return (
    <div className="flex flex-col gap-1 py-1">
      <p className="text-2xl font-bold text-zinc-100 tabular-nums leading-none tracking-tight">
        {value}
        {unit && <span className="text-zinc-600 text-sm font-normal ml-0.5">{unit}</span>}
      </p>
      <p className="text-[11px] text-zinc-500">{label}</p>
      {trend && (
        <p className="text-[10px] text-zinc-600 mt-0.5">{trend}</p>
      )}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any): React.ReactElement | null => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs shadow-xl">
        <p className="text-zinc-400 mb-0.5">{label || payload[0].name}</p>
        <p className="text-zinc-100 font-semibold tabular-nums">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function MonitorPage(): React.ReactElement {
  const { stats } = useMonitor(10000);

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-full py-32">
        <div className="flex flex-col items-center gap-3 text-zinc-700">
          <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="40" strokeDashoffset="10" />
          </svg>
          <span className="text-[11px]">Loading analytics...</span>
        </div>
      </div>
    );
  }

  const canalData: ChartDataPoint[] = stats.byCanal.map(c => ({ name: c.canal, value: c._count }));

  return (
    <div className="p-6 space-y-7">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-sm font-semibold text-zinc-100 tracking-tight">Analytics</h1>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] text-zinc-600">Live · updates every 10s</span>
        </div>
      </div>

      {/* Stat Row */}
      <div className="grid grid-cols-5 gap-6 pb-6 border-b border-zinc-800/80">
        <StatCard label="Total leads" value={stats.totalLeads} trend="All time" />
        <StatCard label="Messages sent" value={stats.totalMessages} trend="All time" />
        <StatCard label="Open rate" value={stats.openRate} unit="%" trend="Last 30 days" />
        <StatCard label="Click rate" value={stats.clickRate} unit="%" trend="Last 30 days" />
        <StatCard label="Reply rate" value={stats.replyRate} unit="%" trend="Last 30 days" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Line chart — leads over time */}
        <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-5">
          <div className="mb-4">
            <h2 className="text-xs font-semibold text-zinc-300">Leads over time</h2>
            <p className="text-[10px] text-zinc-600 mt-0.5">This week</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={LEADS_OVER_TIME} margin={{ top: 2, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid stroke="#27272a" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="day"
                stroke="transparent"
                tick={{ fill: '#52525b', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                stroke="transparent"
                tick={{ fill: '#52525b', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={28}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3f3f46', strokeWidth: 1 }} />
              <Line
                type="monotone"
                dataKey="leads"
                stroke="#6366f1"
                strokeWidth={1.5}
                dot={false}
                activeDot={{ r: 3, fill: '#6366f1', strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar chart — messages per channel */}
        <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-5">
          <div className="mb-4">
            <h2 className="text-xs font-semibold text-zinc-300">Messages by channel</h2>
            <p className="text-[10px] text-zinc-600 mt-0.5">All time</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={canalData} barCategoryGap="40%" margin={{ top: 2, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid stroke="#27272a" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="transparent"
                tick={{ fill: '#52525b', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                stroke="transparent"
                tick={{ fill: '#52525b', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={28}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.05)' }} />
              <Bar dataKey="value" fill="#6366f1" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Leads */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xs font-semibold text-zinc-300">Recent leads</h2>
          <span className="text-[10px] text-zinc-600">{stats.recentLeads.length} entries</span>
        </div>
        <div className="border border-zinc-800/80 rounded-xl overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-800/80 bg-zinc-900/40">
                <th className="px-4 py-2.5 text-left text-[10px] text-zinc-600 font-medium uppercase tracking-widest">Name</th>
                <th className="px-4 py-2.5 text-left text-[10px] text-zinc-600 font-medium uppercase tracking-widest">Score</th>
                <th className="px-4 py-2.5 text-left text-[10px] text-zinc-600 font-medium uppercase tracking-widest">Tier</th>
                <th className="px-4 py-2.5 text-left text-[10px] text-zinc-600 font-medium uppercase tracking-widest">Added</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentLeads.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-[11px] text-zinc-700">
                    No recent leads
                  </td>
                </tr>
              ) : (
                stats.recentLeads.map((l, i) => (
                  <tr
                    key={i}
                    className="border-b border-zinc-800/40 last:border-0 hover:bg-zinc-900/30 transition-colors"
                  >
                    <td className="px-4 py-2.5 font-medium text-zinc-200">{l.nom}</td>
                    <td className="px-4 py-2.5">
                      <span className="font-mono tabular-nums text-zinc-400">
                        {l.score != null ? l.score.toFixed(1) : '—'}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      {l.categorie ? (
                        <TierBadge categorie={l.categorie} />
                      ) : (
                        <span className="text-zinc-700">—</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-zinc-600 font-mono tabular-nums">
                      {new Date(l.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
