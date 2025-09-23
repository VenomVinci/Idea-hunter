import type { AnalysisResult } from '@/types';

type Props = { result: AnalysisResult | null };

export default function RiskRadar({ result }: Props) {
  if (!result) return <div className="text-sm text-white/60">Run an analysis to see risk radar.</div>;

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {result.risks.map((r) => {
        const badge = r.severity === 'high' ? 'bg-red-500/20 text-red-300 ring-red-400/40' : r.severity === 'medium' ? 'bg-amber-500/20 text-amber-200 ring-amber-400/40' : 'bg-emerald-500/20 text-emerald-200 ring-emerald-400/40';
        return (
          <li key={r.label} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-white/90">{r.label}</span>
              <span className={`rounded-full px-2 py-0.5 text-xs ring-1 ring-inset ${badge}`}>{r.severity}</span>
            </div>
            <p className="mt-2 text-sm text-white/70">{r.note}</p>
          </li>
        );
      })}
    </ul>
  );
}