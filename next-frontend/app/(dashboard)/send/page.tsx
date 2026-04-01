"use client";

import { Card } from '../../../components/ui/Card';

export default function SendPage() {
  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Messages</h1>
        <p className="text-sm text-slate-500 mt-1">
          Envoi et suivi de tes messages de prospection.
        </p>
      </header>
      <Card className="p-6">
        <p className="text-sm text-slate-600">
          On y migrera le contenu de l'ancien front avec la nouvelle esthétique.
        </p>
      </Card>
    </div>
  );
}
