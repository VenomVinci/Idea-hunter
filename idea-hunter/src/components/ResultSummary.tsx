import type { AnalysisResult } from '@/types';

type Props = {
  result: AnalysisResult | null;
};

export default function ResultSummary({ result }: Props) {
  if (!result) return (
    <div className="text-sm text-white/60">Run an analysis to see your summary.</div>
  );

  const saturationColor =
    result.saturationLevel === 'high' ? 'text-red-400' : result.saturationLevel === 'medium' ? 'text-amber-300' : 'text-emerald-300';

  return (
    <div className="grid gap-6 sm:grid-cols-3">
      <div className="rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="text-xs text-white/60">Viability score</div>
        <div className="mt-2 text-3xl font-extrabold">{result.viabilityScore}</div>
        <div className="mt-1 text-xs text-white/60">/ 100</div>
      </div>
      <div className="rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="text-xs text-white/60">Market saturation</div>
        <div className={`mt-2 text-xl font-semibold ${saturationColor}`}>{result.saturationLevel}</div>
      </div>
      <div className="rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="text-xs text-white/60">Top risks</div>
        <ul className="mt-2 space-y-1 text-sm">
          {result.risks.slice(0, 3).map((r) => (
            <li key={r.label} className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand-500" />
              <span className="text-white/80">{r.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}