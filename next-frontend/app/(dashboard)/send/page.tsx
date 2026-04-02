"use client";

import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import api from '../../../utils/api';
import { Send, Bot, FileText, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import { CANALS, TEMPLATES } from '../../../constants';

const CANAL_ICONS: Record<string, React.ReactNode> = {
  EMAIL: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  ),
  LINKEDIN: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
    </svg>
  ),
  WHATSAPP: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  SMS: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.35 2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.09 6.09l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
};

const CANAL_ACTIVE: Record<string, string> = {
  EMAIL: 'border-violet-300 bg-violet-50 text-violet-700',
  LINKEDIN: 'border-blue-300 bg-blue-50 text-blue-700',
  WHATSAPP: 'border-emerald-300 bg-emerald-50 text-emerald-700',
  SMS: 'border-amber-300 bg-amber-50 text-amber-700',
};

const TEMPLATE_LABELS: Record<string, string> = {
  cold_email: 'Cold Email — Intro',
  followup_j3: 'Follow-up J+3',
  followup_j7: 'Follow-up J+7',
  linkedin_connect: 'LinkedIn Connect',
  sms: 'SMS Short',
};

type Result = { ok: boolean; message: string } | null;

export default function SendPage() {
  const [leadId, setLeadId] = useState('');
  const [canal, setCanal] = useState<string>('EMAIL');
  const [templateKey, setTemplateKey] = useState<string>('cold_email');
  const [customMessage, setCustomMessage] = useState('');
  const [useAI, setUseAI] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result>(null);

  const handleSend = async () => {
    if (!leadId.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      await api.post('/send', {
        leadId,
        canal,
        templateKey: useAI ? undefined : templateKey,
        customMessage: customMessage || undefined,
        useAI,
      });
      setResult({ ok: true, message: 'Message sent successfully.' });
      setLeadId('');
      setCustomMessage('');
    } catch (err: any) {
      setResult({ ok: false, message: err.response?.data?.error ?? err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl">
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Send size={14} className="text-slate-400" />
          <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Outreach</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Campaigns</h1>
        <p className="text-sm text-slate-500 mt-1">Send personalized messages to your leads across all channels.</p>
      </header>

      <div className="grid grid-cols-2 gap-6">
        {/* Compose */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-slate-900 mb-5">Compose Message</h2>
          <div className="space-y-4">
            {/* Lead ID */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Lead ID <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={leadId}
                onChange={e => setLeadId(e.target.value)}
                placeholder="paste lead UUID here..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent font-mono transition-all"
              />
              <p className="text-[11px] text-slate-400 mt-1">Find the Lead ID in the ··· menu on any lead row.</p>
            </div>

            {/* Channel */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Channel</label>
              <div className="grid grid-cols-4 gap-2">
                {CANALS.map(c => (
                  <button
                    key={c}
                    onClick={() => setCanal(c)}
                    className={`flex flex-col items-center gap-1.5 py-2.5 rounded-lg text-[11px] font-medium border transition-all ${
                      canal === c
                        ? CANAL_ACTIVE[c] || 'border-violet-300 bg-violet-50 text-violet-700'
                        : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700'
                    }`}
                  >
                    <span className={canal === c ? '' : 'opacity-50'}>{CANAL_ICONS[c]}</span>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* AI toggle */}
            <div className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${useAI ? 'bg-violet-100' : 'bg-slate-100'}`}>
                  <Zap size={11} className={useAI ? 'text-violet-600' : 'text-slate-400'} />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-900">AI Personalization</p>
                  <p className="text-[11px] text-slate-400">Generate message with GPT</p>
                </div>
              </div>
              <button
                onClick={() => setUseAI(v => !v)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${useAI ? 'bg-violet-600' : 'bg-slate-200'}`}
              >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${useAI ? 'translate-x-4' : 'translate-x-1'}`} />
              </button>
            </div>

            {/* Template or custom */}
            {!useAI && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Template</label>
                <select
                  value={templateKey}
                  onChange={e => setTemplateKey(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                >
                  {TEMPLATES.map(t => (
                    <option key={t} value={t}>{TEMPLATE_LABELS[t] ?? t}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Custom message <span className="font-normal text-slate-400">(optional — overrides template)</span>
              </label>
              <textarea
                value={customMessage}
                onChange={e => setCustomMessage(e.target.value)}
                rows={4}
                placeholder="Type a custom message..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none transition-all"
              />
            </div>

            {result && (
              <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium border ${
                result.ok
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                {result.ok ? <CheckCircle size={13} /> : <AlertCircle size={13} />}
                {result.message}
              </div>
            )}

            <Button
              variant="primary"
              className="w-full"
              onClick={handleSend}
              disabled={loading || !leadId.trim()}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="40" strokeDashoffset="10" />
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <Send size={13} />
                  Send Message
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Info panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center">
                <Bot size={14} className="text-violet-600" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">AI Personalization</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              When enabled, GPT generates a unique message based on the lead's profile — sector, title, and company — for higher response rates.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                <FileText size={14} className="text-blue-600" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">Templates</h3>
            </div>
            <div className="space-y-1.5">
              {TEMPLATES.map(t => (
                <div key={t} className="flex items-center gap-2 py-1">
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  <span className="text-xs text-slate-500">{TEMPLATE_LABELS[t] ?? t}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 rounded-xl border border-amber-100 p-4">
            <div className="flex items-start gap-2">
              <AlertCircle size={13} className="text-amber-500 mt-0.5 shrink-0" />
              <p className="text-[11px] text-amber-700 leading-relaxed">
                <span className="font-semibold">Tip:</span> Find the Lead ID in your Leads Pipeline table. Click the ··· menu on any lead and copy its ID.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
