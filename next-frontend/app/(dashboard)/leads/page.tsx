import LeadsContent from './LeadsContent';
import { Users } from 'lucide-react';

export default function LeadsPage() {
  return (
    <div className="p-8">
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Users size={14} className="text-slate-400" />
          <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Pipeline</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Leads Pipeline</h1>
        <p className="text-sm text-slate-500 mt-0.5">Gère tes prospects et fais avancer tes deals.</p>
      </header>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <LeadsContent />
      </div>
    </div>
  );
}
