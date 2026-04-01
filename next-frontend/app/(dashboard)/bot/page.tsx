"use client";

import { Card } from '../../../components/ui/Card';

export default function BotPage() {
  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Bot Engine</h1>
        <p className="text-sm text-slate-500 mt-1">
          Configuration et logique de ton bot de prospection.
        </p>
      </header>
      <Card className="p-6">
        <p className="text-sm text-slate-600">
          On migrera ici le contenu de BotPage avec la nouvelle esthétique.
        </p>
      </Card>
    </div>
  );
}
