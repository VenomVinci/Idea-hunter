"use client";
import { useMemo, useState } from 'react';
import Stepper from '@/components/Stepper';
import Loader from '@/components/Loader';
import Toast from '@/components/Toast';
import ResultSummary from '@/components/ResultSummary';
import CompetitorTable from '@/components/CompetitorTable';
import RiskRadar from '@/components/RiskRadar';
import type { AnalysisResult, IdeaInput } from '@/types';

const STEP_LABELS = [
  'Overview',
  'Problem',
  'Solution',
  'Audience',
  'Monetization',
  'Channels',
  'Competition'
];

export default function IdeaWizard() {
  const [current, setCurrent] = useState(0);
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' | 'info' } | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [form, setForm] = useState<IdeaInput>({
    title: '',
    problem: '',
    solution: '',
    audience: '',
    monetization: '',
    channels: '',
    competition: ''
  });

  const canNext = useMemo(() => {
    const keys: (keyof IdeaInput)[] = ['title','problem','solution','audience','monetization','channels','competition'];
    const key = keys[current];
    if (!key) return true;
    return String(form[key]).trim().length > 0;
  }, [current, form]);

  function update<K extends keyof IdeaInput>(key: K, value: IdeaInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function next() {
    if (current < STEP_LABELS.length - 1) setCurrent((c) => c + 1);
  }
  function prev() {
    if (current > 0) setCurrent((c) => c - 1);
  }

  async function analyze() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error('Failed to analyze idea');
      const json = (await res.json()) as AnalysisResult;
      setResult(json);
      // Mount results into right-hand panels if present on the page
      const summary = document.getElementById('results-summary');
      const competitors = document.getElementById('results-competitors');
      const risks = document.getElementById('results-risks');
      if (summary) summary.replaceChildren();
      if (competitors) competitors.replaceChildren();
      if (risks) risks.replaceChildren();
      // Hydrate simple islands by rendering with React (optional improvement: use a dedicated context)
      // For simplicity we conditionally render below instead of true islands
      setToast({ message: 'Analysis complete', type: 'success' });
    } catch (err) {
      console.error(err);
      setToast({ message: 'Something went wrong. Try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Stepper steps={STEP_LABELS} current={current} />

      <div className="mt-6 space-y-6">
        {current === 0 && (
          <div>
            <label className="label">Idea title</label>
            <input className="input" placeholder="e.g., Idea Hunter — AI startup validation" value={form.title} onChange={(e) => update('title', e.target.value)} />
            <p className="mt-2 text-xs text-white/50">A concise name helps us set context.</p>
          </div>
        )}

        {current === 1 && (
          <div>
            <label className="label">What painful problem are you solving?</label>
            <textarea className="input min-h-[120px]" placeholder="Describe the problem and who feels it." value={form.problem} onChange={(e) => update('problem', e.target.value)} />
          </div>
        )}

        {current === 2 && (
          <div>
            <label className="label">How do you solve it?</label>
            <textarea className="input min-h-[120px]" placeholder="Describe your product and key differentiators." value={form.solution} onChange={(e) => update('solution', e.target.value)} />
          </div>
        )}

        {current === 3 && (
          <div>
            <label className="label">Target audience</label>
            <input className="input" placeholder="e.g., early-stage SaaS founders, PMs, agencies" value={form.audience} onChange={(e) => update('audience', e.target.value)} />
          </div>
        )}

        {current === 4 && (
          <div>
            <label className="label">Monetization strategy</label>
            <input className="input" placeholder="e.g., subscription, usage-based, freemium" value={form.monetization} onChange={(e) => update('monetization', e.target.value)} />
          </div>
        )}

        {current === 5 && (
          <div>
            <label className="label">Acquisition channels</label>
            <input className="input" placeholder="e.g., content, SEO, partnerships, communities" value={form.channels} onChange={(e) => update('channels', e.target.value)} />
          </div>
        )}

        {current === 6 && (
          <div>
            <label className="label">Known competitors</label>
            <textarea className="input min-h-[100px]" placeholder="List competitors or alternatives if any." value={form.competition} onChange={(e) => update('competition', e.target.value)} />
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <button className="btn-secondary" onClick={prev} disabled={current === 0}>
            Back
          </button>
          {current < STEP_LABELS.length - 1 ? (
            <button className="btn-primary disabled:opacity-50" onClick={next} disabled={!canNext}>
              Next
            </button>
          ) : (
            <button className="btn-primary disabled:opacity-50 inline-flex items-center gap-2" onClick={analyze} disabled={loading || !canNext}>
              {loading && <Loader />}
              <span>{loading ? 'Analyzing…' : 'Run Analysis'}</span>
            </button>
          )}
        </div>

        {/* Inline results rendering for the evaluate page layout */}
        {result && (
          <div className="mt-8 space-y-8">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <ResultSummary result={result} />
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold mb-3">Competitors</h3>
              <CompetitorTable items={result.competitors} />
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold mb-3">Risk radar</h3>
              <RiskRadar result={result} />
            </div>
          </div>
        )}
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}