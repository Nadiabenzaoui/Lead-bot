import LeadsContent from './LeadsContent';

export default function LeadsPage() {
  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Leads Pipeline</h1>
        <p className="text-sm text-slate-500 mt-1">Gère tes prospects et fais avancer tes deals.</p>
      </header>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <LeadsContent />
      </div>
    </div>
  );
}
