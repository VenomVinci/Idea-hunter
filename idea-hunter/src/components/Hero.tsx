import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-2xl card">
      <div className="absolute inset-0 bg-gradient-to-r from-brand-600/20 via-purple-700/10 to-transparent" />
      <div className="relative grid gap-10 p-8 sm:p-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <span className="badge">AI-Powered Validation</span>
          <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold leading-tight">
            See the truth behind your idea
          </h1>
          <p className="mt-4 text-white/70 max-w-2xl">
            Avoid tarpit ideas. Idea Hunter delivers deep market research, competitor intelligence,
            and real-time signals so you can invest with confidence.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/evaluate" className="btn-primary">Start Free</Link>
            <a href="#features" className="btn-secondary">Learn More</a>
          </div>
          <div className="mt-6 flex flex-wrap gap-4 text-xs text-white/50">
            <span>• No credit card</span>
            <span>• Results in minutes</span>
            <span>• Actionable insights</span>
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="h-full w-full rounded-xl border border-white/10 bg-gradient-to-br from-brand-500/20 to-transparent p-6">
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="h-3 w-20 rounded bg-white/20" />
                  <div className="mt-3 h-2 w-full rounded bg-brand-600/50" />
                  <div className="mt-2 h-2 w-3/4 rounded bg-white/15" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}