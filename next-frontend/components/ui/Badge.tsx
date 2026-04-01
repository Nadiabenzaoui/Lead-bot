import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'hot' | 'warm' | 'cold' | 'default';
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2',
          {
            'bg-emerald-100/80 text-emerald-700 border border-emerald-200': variant === 'hot',
            'bg-amber-100/80 text-amber-700 border border-amber-200': variant === 'warm',
            'bg-slate-100 text-slate-600 border border-slate-200': variant === 'cold',
            'bg-white text-slate-700 border border-slate-200': variant === 'default',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';

export function TierBadge({ categorie }: { categorie: string }) {
  const variant = categorie === 'CHAUD' ? 'hot'
    : categorie === 'TIEDE' ? 'warm'
      : categorie === 'FROID' ? 'cold' : 'default';
  return <Badge variant={variant}>{categorie}</Badge>;
}

export function StatusBadge({ statut, onChange, statuts }: { statut: string, onChange?: (val: string) => void, statuts?: readonly string[] }) {
  if (!onChange || !statuts) {
    return <Badge>{statut}</Badge>;
  }
  return (
    <select
      value={statut}
      onChange={e => onChange(e.target.value)}
      className="bg-slate-50 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-slate-200 text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-400 outline-none"
    >
      {statuts.map(s => <option key={s} value={s}>{s}</option>)}
    </select>
  );
}

export { Badge };
