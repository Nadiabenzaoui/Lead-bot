import React, { useState, useRef, useEffect } from 'react';
import { useBot } from '../hooks/useBot';
import { Button } from '../components/ui/Button';
import { Toggle } from '../components/ui/Toggle';
import { BotConfig } from '../types';

const LOG_COLORS: Record<string, string> = {
  log: 'text-zinc-500',
  lead: 'text-emerald-400',
  done: 'text-indigo-400',
  error: 'text-red-400',
  warn: 'text-amber-400',
};

const LOG_TAG_COLORS: Record<string, string> = {
  log: 'text-zinc-600 bg-zinc-800',
  lead: 'text-emerald-300 bg-emerald-500/10',
  done: 'text-indigo-300 bg-indigo-500/10',
  error: 'text-red-300 bg-red-500/10',
  warn: 'text-amber-300 bg-amber-500/10',
};

const LOG_TAG: Record<string, string> = {
  log: 'info',
  lead: 'lead',
  done: 'done',
  error: 'err',
  warn: 'warn',
};

function PlayIcon(): React.ReactElement {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function StopIcon(): React.ReactElement {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </svg>
  );
}

function ClearIcon(): React.ReactElement {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

export default function BotPage(): React.ReactElement {
  const { running, logs, status, start, stop, clearLogs } = useBot();
  const [form, setForm] = useState<BotConfig>({ keywords: '', location: '', limit: 20, autoSend: false });
  const logsEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleStart = async () => {
    if (!form.keywords) return alert('Keywords are required');
    await start(form);
  };

  const statusItems: { label: string; value: number; color: string }[] = status
    ? [
        { label: 'Waiting', value: status.waiting, color: 'text-zinc-400' },
        { label: 'Active', value: status.active, color: 'text-emerald-400' },
        { label: 'Done', value: status.completed, color: 'text-indigo-400' },
        { label: 'Failed', value: status.failed, color: 'text-red-400' },
      ]
    : [];

  return (
    <div className="p-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-sm font-semibold text-zinc-100 tracking-tight">Bot Engine</h1>
        {status && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${running ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-700'}`} />
              <span className="text-[11px] text-zinc-500">{running ? 'Running' : 'Idle'}</span>
            </div>
            <div className="w-px h-3.5 bg-zinc-800" />
            {statusItems.map(({ label, value, color }) => (
              <div key={label} className="flex items-center gap-1">
                <span className={`text-xs font-semibold tabular-nums font-mono ${color}`}>{value}</span>
                <span className="text-[11px] text-zinc-600">{label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-5 h-[calc(100vh-9.5rem)]">
        {/* Left: Config */}
        <div className="w-72 flex-shrink-0 flex flex-col gap-4 overflow-y-auto">
          {/* Search configuration */}
          <div>
            <h2 className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-3">
              Search configuration
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-zinc-500 mb-1.5 block font-medium">
                  Keywords <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-zinc-600 transition-colors"
                  placeholder="e.g. CEO SaaS Paris"
                  value={form.keywords}
                  onChange={e => setForm({ ...form, keywords: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[11px] text-zinc-500 mb-1.5 block font-medium">Location</label>
                <input
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-zinc-600 transition-colors"
                  placeholder="e.g. France"
                  value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[11px] text-zinc-500 mb-1.5 block font-medium">Lead limit</label>
                <input
                  type="number"
                  min={1}
                  max={500}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600 transition-colors"
                  value={form.limit}
                  onChange={e => setForm({ ...form, limit: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>

          {/* Options */}
          <div>
            <h2 className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-3">
              Options
            </h2>
            <Toggle
              checked={form.autoSend}
              onChange={v => setForm({ ...form, autoSend: v })}
              label="Auto-send emails"
              description="Automatically sends an email to each discovered lead"
            />
          </div>

          <div className="flex-1" />

          {/* Actions */}
          <div className="space-y-2">
            <button
              onClick={handleStart}
              disabled={running}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg transition-colors"
            >
              {running ? (
                <>
                  <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="40" strokeDashoffset="10" />
                  </svg>
                  Running...
                </>
              ) : (
                <>
                  <PlayIcon />
                  Start bot
                </>
              )}
            </button>
            <button
              onClick={stop}
              disabled={!running}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-transparent border border-zinc-800 hover:border-red-500/40 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-500 text-xs font-semibold rounded-lg transition-colors"
            >
              <StopIcon />
              Stop bot
            </button>
          </div>
        </div>

        {/* Right: Terminal */}
        <div className="flex-1 flex flex-col bg-zinc-950 border border-zinc-800/80 rounded-xl overflow-hidden">
          {/* Terminal header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/60 border-b border-zinc-800/80">
            <div className="flex items-center gap-2.5">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
              </div>
              <span className="text-[11px] text-zinc-600 font-mono ml-1">Live output</span>
            </div>
            <div className="flex items-center gap-3">
              {running && (
                <span className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Running
                </span>
              )}
              <button
                onClick={clearLogs}
                className="flex items-center gap-1 text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <ClearIcon />
                Clear
              </button>
            </div>
          </div>

          {/* Log content */}
          <div className="flex-1 overflow-y-auto p-4 font-mono text-[11px] leading-relaxed">
            {logs.length === 0 ? (
              <div className="flex items-center gap-2 text-zinc-700">
                <span className="text-zinc-800 select-none">$</span>
                <span>Waiting for start...</span>
                <span className="inline-block w-1.5 h-3 bg-zinc-700 animate-pulse ml-0.5" />
              </div>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="flex gap-3 mb-0.5 hover:bg-zinc-900/30 rounded px-1 -mx-1 py-px transition-colors">
                  <span className="text-zinc-700 flex-shrink-0 tabular-nums select-none w-16">{log.ts}</span>
                  <span className={`flex-shrink-0 px-1.5 py-px rounded text-[10px] font-semibold uppercase tracking-wide ${LOG_TAG_COLORS[log.type] || 'text-zinc-600 bg-zinc-800'}`}>
                    {LOG_TAG[log.type] || 'info'}
                  </span>
                  <span className={LOG_COLORS[log.type] || 'text-zinc-400'}>{log.message}</span>
                </div>
              ))
            )}
            <div ref={logsEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
