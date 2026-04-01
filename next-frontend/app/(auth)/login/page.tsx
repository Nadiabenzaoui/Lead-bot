import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center px-4">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-10 items-center">
        <div className="hidden md:block">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-indigo-400 text-base leading-none">●</span>
            <span
              className="text-xs font-semibold tracking-widest text-zinc-200 uppercase"
              style={{ fontVariant: 'small-caps', letterSpacing: '0.12em' }}
            >
              LeadBot
            </span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-50 mb-3">
            Reprends le contrôle de ta prospection.
          </h1>
          <p className="text-sm text-zinc-400 mb-6 max-w-md">
            Connecte-toi pour accéder à ton cockpit : leads qualifiés, séquences en cours, réponses à traiter et performance de ton bot.
          </p>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
            <p className="text-[11px] text-zinc-500 mb-2 font-medium uppercase tracking-wide">Ce que tu verras ensuite</p>
            <ul className="space-y-1.5 text-[11px] text-zinc-400">
              <li>• Vue pipeline par tiers (CHAUD / TIEDE / FROID).</li>
              <li>• Statuts en temps réel de tes campagnes de messages.</li>
              <li>• Logs détaillés de chaque action du bot.</li>
            </ul>
          </div>
        </div>

        <div className="w-full max-w-sm mx-auto">
          <div className="flex items-center gap-2 mb-5 md:hidden justify-center">
            <span className="text-indigo-400 text-base leading-none">●</span>
            <span
              className="text-xs font-semibold tracking-widest text-zinc-200 uppercase"
              style={{ fontVariant: 'small-caps', letterSpacing: '0.12em' }}
            >
              LeadBot
            </span>
          </div>

          <div className="px-6 py-7 rounded-2xl border border-zinc-800 bg-zinc-950/80 shadow-[0_0_60px_rgba(88,28,135,0.35)]">
            <div className="space-y-1 mb-6">
              <h2 className="text-sm font-semibold text-zinc-100 tracking-tight">Connexion à ton espace</h2>
              <p className="text-xs text-zinc-500">
                Entre tes identifiants pour accéder à ton dashboard. Pour l&apos;instant, l&apos;authentification est en mode démo.
              </p>
            </div>
            <form className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-400">Email professionnel</label>
                <input
                  type="email"
                  className="w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-600"
                  placeholder="toi@startup.fr"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-400">Mot de passe</label>
                <input
                  type="password"
                  className="w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-600"
                  placeholder="••••••••"
                />
                <div className="flex items-center justify-between mt-1">
                  <label className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                    <input type="checkbox" className="w-3.5 h-3.5 rounded border-zinc-700 bg-zinc-900" />
                    Se souvenir de moi
                  </label>
                  <button type="button" className="text-[11px] text-zinc-500 hover:text-zinc-300">
                    Mot de passe oublié ?
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="w-full mt-2 inline-flex items-center justify-center rounded-md bg-indigo-600 hover:bg-indigo-700 text-xs font-medium px-3 py-2.5 transition-colors"
              >
                Se connecter
              </button>
            </form>
            <p className="mt-4 text-[11px] text-zinc-600 text-center">
              Pas encore de compte ? <span className="text-zinc-400">On ajoutera bientôt l&apos;inscription.</span>
            </p>
            <p className="mt-4 text-[11px] text-zinc-600 text-center">
              Tu peux aussi{' '}
              <Link href="/dashboard" className="text-indigo-400 hover:text-indigo-300">
                explorer le dashboard de démo
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

