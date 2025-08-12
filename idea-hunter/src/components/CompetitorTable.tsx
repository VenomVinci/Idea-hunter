import type { Competitor } from '@/types';

type Props = {
  items: Competitor[] | null;
};

export default function CompetitorTable({ items }: Props) {
  if (!items || items.length === 0) return (
    <div className="text-sm text-white/60">No competitors yet. Run an analysis.</div>
  );

  return (
    <div className="overflow-hidden rounded-xl border border-white/10">
      <table className="min-w-full divide-y divide-white/10">
        <thead className="bg-white/5">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-white/60">Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-white/60">Strength</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-white/60">Weakness</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-white/60">Link</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {items.map((c) => (
            <tr key={c.name} className="hover:bg-white/5">
              <td className="px-4 py-3 text-sm font-medium">{c.name}</td>
              <td className="px-4 py-3 text-sm text-white/80">{c.strength}</td>
              <td className="px-4 py-3 text-sm text-white/80">{c.weakness}</td>
              <td className="px-4 py-3 text-sm">
                {c.url ? (
                  <a href={c.url} target="_blank" className="text-brand-300 hover:text-brand-200 underline">Visit</a>
                ) : (
                  <span className="text-white/40">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}