"use client";

import { Card } from '../../../components/ui/Card';

export default function MonitorPage() {
  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">
          Ici on affichera les graphiques et le monitoring de tes campagnes.
        </p>
      </header>
      <Card className="p-6">
        <p className="text-sm text-slate-600">
          La route `/monitor` possède maintenant son nouveau design clair.
        </p>
      </Card>
    </div>
  );
}
