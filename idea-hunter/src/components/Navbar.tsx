import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 backdrop-blur supports-[backdrop-filter]:bg-black/30">
      <div className="container-app flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="Idea Hunter" className="h-7 w-7" />
          <span className="font-bold tracking-tight">Idea Hunter</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
          <Link href="/" className="hover:text-white">Home</Link>
          <a href="#features" className="hover:text-white">Features</a>
          <Link href="/evaluate" className="hover:text-white">Evaluate</Link>
          <a href="https://example.com" className="hover:text-white" target="_blank">Docs</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/evaluate" className="btn-primary hidden sm:inline-flex">Start Free</Link>
        </div>
      </div>
    </header>
  );
}