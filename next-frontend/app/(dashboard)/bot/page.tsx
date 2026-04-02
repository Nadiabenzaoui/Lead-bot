"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import api from '../../../utils/api';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Zap, Clock, CheckCircle2, XCircle } from 'lucide-react';

interface BotStatus {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  lastJob: {
    id: string;
    status: string;
    startedAt: string | null;
    stoppedAt: string | null;
    config: any;
  } | null;
}

interface LogEntry {
  message: string;
  step: string;
  ts: string;
}

function StatusDot({ active }: { active: boolean }) {
  return (
    <span className={`inline-block w-2 h-2 rounded-full ${active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
  );
}

const STAT_CONFIG: Record<string, { accent: string; iconBg: string; iconColor: string; icon: React.ElementType; sub: string }> = {
  Active:    { accent: 'bg-violet-500',  iconBg: 'bg-violet-50',  iconColor: 'text-violet-600',  icon: Zap,          sub: 'Jobs en cours' },
  Waiting:   { accent: 'bg-amber-400',   iconBg: 'bg-amber-50',   iconColor: 'text-amber-600',   icon: Clock,        sub: 'En attente' },
  Completed: { accent: 'bg-emerald-500', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', icon: CheckCircle2, sub: 'Terminés' },
  Failed:    { accent: 'bg-red-400',     iconBg: 'bg-red-50',     iconColor: 'text-red-500',     icon: XCircle,      sub: 'Échoués' },
};

function StatCard({ label, value }: { label: string; value: number }) {
  const cfg = STAT_CONFIG[label];
  const Icon = cfg?.icon;
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 relative overflow-hidden hover:shadow-md transition-shadow">
      <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${cfg?.accent || 'bg-slate-300'} rounded-l-xl`} />
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        {Icon && (
          <div className={`p-1.5 rounded-lg ${cfg.iconBg}`}>
            <Icon size={14} className={cfg.iconColor} />
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-slate-900 tabular-nums">{value}</p>
      {cfg?.sub && <p className="text-[11px] text-slate-400 mt-1">{cfg.sub}</p>}
    </div>
  );
}

export default function BotPage() {
  const [status, setStatus] = useState<BotStatus | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    keywords: '',
    location: '',
    limit: 20,
    autoSend: false,
  });

  const socketRef = useRef<Socket | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const { data } = await api.get<BotStatus>('/bot/status');
      setStatus(data);
      setRunning(data.active > 0 || data.waiting > 0);
    } catch {}
  }, []);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
    const socket = io(apiUrl);
    socketRef.current = socket;

    socket.on('bot:log', (data: { message: string; step: string }) => {
      setLogs(prev => [...prev, { ...data, ts: new Date().toLocaleTimeString() }]);
    });
    socket.on('bot:done', (data: { total: number }) => {
      setLogs(prev => [...prev, { message: `Terminé — ${data.total} leads sauvegardés`, step: 'done', ts: new Date().toLocaleTimeString() }]);
      setRunning(false);
      fetchStatus();
    });
    socket.on('bot:error', (data: { message: string }) => {
      setLogs(prev => [...prev, { message: `Erreur: ${data.message}`, step: 'error', ts: new Date().toLocaleTimeString() }]);
      setRunning(false);
    });

    return () => {
      clearInterval(interval);
      socket.disconnect();
    };
  }, [fetchStatus]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleStart = async () => {
    if (!form.keywords.trim()) return;
    setLoading(true);
    setLogs([]);
    try {
      await api.post('/bot/start', form);
      setRunning(true);
      fetchStatus();
    } catch (err: any) {
      setLogs([{ message: `Erreur: ${err.message}`, step: 'error', ts: new Date().toLocaleTimeString() }]);
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    try {
      await api.post('/bot/stop', {});
      setRunning(false);
      fetchStatus();
    } catch {}
  };

  const stepColors: Record<string, string> = {
    scrape: 'text-violet-600',
    enrich: 'text-blue-500',
    score: 'text-amber-500',
    dedup: 'text-slate-500',
    send: 'text-emerald-500',
    done: 'text-emerald-600',
    error: 'text-red-500',
  };

  return (
    <div className="p-8 max-w-4xl">
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Automation</span>
        </div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Bot Engine</h1>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-full text-xs text-slate-500 font-medium shadow-sm">
            <StatusDot active={running} />
            {running ? 'Running' : 'Idle'}
          </div>
        </div>
        <p className="text-sm text-slate-500 mt-0.5">Configure et lance ton bot de prospection automatique.</p>
      </header>

      {/* Stats */}
      {status && (
        <div className="grid grid-cols-4 gap-3 mb-8">
          <StatCard label="Active" value={status.active} />
          <StatCard label="Waiting" value={status.waiting} />
          <StatCard label="Completed" value={status.completed} />
          <StatCard label="Failed" value={status.failed} />
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        {/* Config form */}
        <Card className="p-6">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Configuration</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Domain <span className="text-red-400">*</span>
                <span className="ml-1 text-slate-400 font-normal">(Hunter.io)</span>
              </label>
              <input
                type="text"
                value={form.keywords}
                onChange={e => setForm(f => ({ ...f, keywords: e.target.value }))}
                placeholder="ex: stripe.com"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
              />
              <p className="text-[11px] text-slate-400 mt-1">Recherche tous les contacts du domaine via Hunter.io</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                placeholder="ex: Paris, France"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Limit</label>
              <input
                type="number"
                min={1}
                max={100}
                value={form.limit}
                onChange={e => setForm(f => ({ ...f, limit: parseInt(e.target.value) || 20 }))}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
              />
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-xs font-medium text-slate-700">Auto-send emails</p>
                <p className="text-[11px] text-slate-400">Envoie automatiquement les cold emails</p>
              </div>
              <button
                onClick={() => setForm(f => ({ ...f, autoSend: !f.autoSend }))}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${form.autoSend ? 'bg-violet-600' : 'bg-slate-200'}`}
              >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${form.autoSend ? 'translate-x-4' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleStart}
                disabled={running || loading || !form.keywords.trim()}
              >
                {loading ? 'Démarrage...' : 'Lancer le bot'}
              </Button>
              {running && (
                <Button variant="secondary" onClick={handleStop}>
                  Stop
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Logs */}
        <Card className="flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <span className="text-xs font-medium text-slate-500 ml-1">Live Logs</span>
            </div>
            {running && (
              <span className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            )}
            {logs.length > 0 && !running && (
              <button
                onClick={() => setLogs([])}
                className="text-[11px] text-slate-400 hover:text-slate-600 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex-1 bg-slate-950 p-4 h-72 overflow-y-auto font-mono text-[11px] space-y-1.5">
            {logs.length === 0 ? (
              <div className="flex items-center gap-2 text-slate-600">
                <span className="text-slate-700">$</span>
                <span>Waiting for bot to start...</span>
                <span className="animate-pulse">_</span>
              </div>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="flex gap-3 group">
                  <span className="text-slate-700 shrink-0 tabular-nums">{log.ts}</span>
                  <span className={`shrink-0 font-semibold ${stepColors[log.step] || 'text-slate-500'}`}>
                    [{log.step}]
                  </span>
                  <span className={log.step === 'error' ? 'text-red-400' : log.step === 'done' ? 'text-emerald-400' : 'text-slate-300'}>
                    {log.message}
                  </span>
                </div>
              ))
            )}
            <div ref={logsEndRef} />
          </div>
        </Card>
      </div>

      {/* Last job */}
      {status?.lastJob && (
        <Card className="p-6 mt-6">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">Dernier job</h2>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className={`px-2 py-0.5 rounded-full font-medium text-[11px] ${
              status.lastJob.status === 'running' ? 'bg-violet-100 text-violet-700' :
              status.lastJob.status === 'stopped' ? 'bg-red-100 text-red-600' :
              'bg-emerald-100 text-emerald-700'
            }`}>
              {status.lastJob.status}
            </span>
            {status.lastJob.config?.keywords && (
              <span>Keywords: <strong className="text-slate-700">{status.lastJob.config.keywords}</strong></span>
            )}
            {status.lastJob.startedAt && (
              <span>Démarré: {new Date(status.lastJob.startedAt).toLocaleString()}</span>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
