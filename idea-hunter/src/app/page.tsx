import Hero from '@/components/Hero';
import FeatureGrid from '@/components/FeatureGrid';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="space-y-16 sm:space-y-24">
      <Hero />
      <FeatureGrid />
      <section className="card rounded-2xl p-8 sm:p-12 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">See the truth behind your idea</h2>
        <p className="mt-3 text-white/70 max-w-2xl mx-auto">
          Run a full validation in minutes. Identify market saturation, risks, and untapped niches.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link href="/evaluate" className="btn-primary">Start Evaluating</Link>
          <a href="#features" className="btn-secondary">Explore Features</a>
        </div>
      </section>
    </div>
  );
}