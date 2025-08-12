import IdeaWizard from '@/components/IdeaWizard';

export default function EvaluatePage() {
  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-5 card rounded-2xl p-6 sm:p-8 h-fit sticky top-6">
        <h1 className="text-2xl font-bold">Evaluate your idea</h1>
        <p className="mt-2 text-sm text-white/70">Answer a few questions and get a deep-dive analysis.</p>
        <div className="mt-6">
          <IdeaWizard />
        </div>
      </div>
      <div className="lg:col-span-7 space-y-8">
        <section className="card rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl font-semibold">Summary</h2>
          <p className="mt-2 text-sm text-white/70">Results will appear here after analysis.</p>
          <div id="results-summary" />
        </section>
        <section className="card rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl font-semibold">Competitors</h2>
          <div id="results-competitors" />
        </section>
        <section className="card rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl font-semibold">Risk radar</h2>
          <div id="results-risks" />
        </section>
      </div>
    </div>
  );
}