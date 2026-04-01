import React, { useState, useRef, useEffect } from 'react';
import { useSend } from '../hooks/useSend';
import { Toggle } from '../components/ui/Toggle';
import { Canal, SendForm } from '../types';

const CANAL_OPTIONS: { key: Canal; label: string; icon: React.ReactElement }[] = [
  {
    key: 'EMAIL',
    label: 'Email',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    key: 'LINKEDIN',
    label: 'LinkedIn',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    key: 'WHATSAPP',
    label: 'WhatsApp',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
  },
  {
    key: 'SMS',
    label: 'SMS',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
];

const TEMPLATE_OPTIONS: { key: string; label: string; description: string }[] = [
  { key: 'cold_email', label: 'Cold Email', description: 'First cold outreach' },
  { key: 'followup_j3', label: 'Follow-up +3d', description: 'Follow up after 3 days' },
  { key: 'followup_j7', label: 'Follow-up +7d', description: 'Follow up after 7 days' },
  { key: 'linkedin_connect', label: 'LinkedIn Connect', description: 'LinkedIn invitation' },
  { key: 'sms', label: 'Short SMS', description: 'Concise SMS message' },
];

function AIIcon(): React.ReactElement {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function ChevronDown({ size = 12 }: { size?: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export default function SendPage(): React.ReactElement {
  const { leads, loading, result, send } = useSend();
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [form, setForm] = useState<SendForm>({
    leadId: '',
    canal: 'EMAIL',
    templateKey: '',
    customMessage: '',
    useAI: false,
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selectedLead = leads.find(l => l.id === form.leadId);

  const filteredLeads = leads.filter(l => {
    const q = searchQuery.toLowerCase();
    return l.nom.toLowerCase().includes(q) || (l.email || '').toLowerCase().includes(q);
  });

  const handleSend = async () => {
    if (!form.leadId) return alert('Select a lead');
    await send(form);
  };

  const charCount = form.customMessage.length;
  const charMax = 2000;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-sm font-semibold text-zinc-100 tracking-tight">New Message</h1>
        <p className="text-[11px] text-zinc-600 mt-1">Select a lead, channel, and template to send</p>
      </div>

      <div className="max-w-xl space-y-5">
        {/* Lead combobox */}
        <div>
          <label className="text-[11px] font-medium text-zinc-500 block mb-1.5">Recipient</label>
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => { setDropdownOpen(o => !o); setSearchQuery(''); }}
              className="w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-left hover:border-zinc-700 focus:outline-none focus:border-zinc-600 transition-colors"
            >
              {selectedLead ? (
                <span className="text-zinc-200">
                  {selectedLead.nom}{selectedLead.email ? ` — ${selectedLead.email}` : ''}
                </span>
              ) : (
                <span className="text-zinc-600">Search and select a lead...</span>
              )}
              <span className="text-zinc-600 flex-shrink-0"><ChevronDown /></span>
            </button>

            {dropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-20 overflow-hidden">
                <div className="px-3 py-2 border-b border-zinc-800">
                  <input
                    autoFocus
                    className="w-full bg-transparent border-none outline-none text-xs text-zinc-200 placeholder-zinc-600"
                    placeholder="Type to filter..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="max-h-52 overflow-y-auto">
                  {filteredLeads.length === 0 ? (
                    <p className="px-3 py-3 text-[11px] text-zinc-700 text-center">No leads found</p>
                  ) : (
                    filteredLeads.map(l => (
                      <button
                        key={l.id}
                        onClick={() => { setForm({ ...form, leadId: l.id }); setDropdownOpen(false); }}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors hover:bg-zinc-800 ${
                          form.leadId === l.id ? 'text-indigo-300 bg-indigo-600/10' : 'text-zinc-300'
                        }`}
                      >
                        <span className="font-medium">{l.nom}</span>
                        {l.email && <span className="text-zinc-600 truncate">{l.email}</span>}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Canal selector */}
        <div>
          <label className="text-[11px] font-medium text-zinc-500 block mb-1.5">Channel</label>
          <div className="grid grid-cols-4 gap-2">
            {CANAL_OPTIONS.map(c => (
              <button
                key={c.key}
                onClick={() => setForm({ ...form, canal: c.key })}
                className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-lg border text-xs font-medium transition-colors ${
                  form.canal === c.key
                    ? 'border-indigo-500/60 bg-indigo-600/8 text-indigo-300'
                    : 'border-zinc-800 text-zinc-600 hover:border-zinc-700 hover:text-zinc-400'
                }`}
              >
                <span>{c.icon}</span>
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Template dropdown */}
        <div>
          <label className="text-[11px] font-medium text-zinc-500 block mb-1.5">Template</label>
          <div className="relative">
            <select
              className="w-full appearance-none bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-zinc-600 transition-colors disabled:opacity-40 cursor-pointer pr-8"
              value={form.templateKey}
              onChange={e => setForm({ ...form, templateKey: e.target.value })}
              disabled={form.useAI}
            >
              <option value="">No template — custom message only</option>
              {TEMPLATE_OPTIONS.map(t => (
                <option key={t.key} value={t.key}>{t.label} — {t.description}</option>
              ))}
            </select>
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none">
              <ChevronDown />
            </span>
          </div>
        </div>

        {/* Message area */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-medium text-zinc-500">Message</label>
            <div className="flex items-center gap-2">
              <AIIcon />
              <span className={`text-[11px] font-medium ${form.useAI ? 'text-indigo-300' : 'text-zinc-600'}`}>
                Generate with AI
              </span>
              <Toggle
                checked={form.useAI}
                onChange={v => setForm({ ...form, useAI: v })}
              />
            </div>
          </div>
          <div className="relative">
            <textarea
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-zinc-600 resize-none transition-colors disabled:opacity-40"
              rows={6}
              placeholder={form.useAI ? 'AI will generate the message...' : 'Write your message here...'}
              value={form.customMessage}
              onChange={e => setForm({ ...form, customMessage: e.target.value })}
              disabled={form.useAI}
            />
            <span className={`absolute bottom-2.5 right-3 text-[10px] tabular-nums font-mono ${charCount > charMax * 0.9 ? 'text-amber-500' : 'text-zinc-700'}`}>
              {charCount}/{charMax}
            </span>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div
            className={`flex items-start gap-2.5 p-3.5 rounded-lg border text-xs ${
              result.success
                ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
                : 'bg-red-500/5 border-red-500/20 text-red-400'
            }`}
          >
            {result.success ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            )}
            {result.message}
          </div>
        )}

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={loading || !form.leadId}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg transition-colors"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="40" strokeDashoffset="10" />
              </svg>
              Sending...
            </>
          ) : (
            <>Send message →</>
          )}
        </button>
      </div>
    </div>
  );
}
