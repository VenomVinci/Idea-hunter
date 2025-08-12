export default function FeatureGrid() {
  const features = [
    {
      title: 'Deep market research',
      desc: 'Aggregate signals across datasets to reveal real demand and trend momentum.',
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-brand-300"><path fill="currentColor" d="M11 2v20M2 11h20" opacity=".3"/><path fill="currentColor" d="M4 19l6-6 4 4 6-6"/></svg>
      )
    },
    {
      title: 'Competitor intelligence',
      desc: 'Map the landscape, find gaps, and benchmark strengths and weaknesses.',
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-brand-300"><path fill="currentColor" d="M12 3a9 9 0 100 18 9 9 0 000-18zm0 4a5 5 0 110 10A5 5 0 0112 7z"/></svg>
      )
    },
    {
      title: 'Risk radar',
      desc: 'Identify red flags early: saturation, CAC, retention, and differentiation.',
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-brand-300"><path fill="currentColor" d="M12 22l-8-4V6l8-4 8 4v12z"/></svg>
      )
    },
    {
      title: 'Actionable guidance',
      desc: 'Turn insights into strategy with step-by-step recommendations.',
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-brand-300"><path fill="currentColor" d="M4 4h16v4H4zM4 10h10v4H4zM4 16h7v4H4z"/></svg>
      )
    }
  ];

  return (
    <section id="features" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {features.map((f) => (
        <div key={f.title} className="card rounded-2xl p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/15">
            {f.icon}
          </div>
          <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
          <p className="mt-2 text-sm text-white/70">{f.desc}</p>
        </div>
      ))}
    </section>
  );
}