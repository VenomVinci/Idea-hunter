export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10">
      <div className="container-app py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-white/50">© {new Date().getFullYear()} Idea Hunter. All rights reserved.</p>
        <div className="flex items-center gap-4 text-xs text-white/60">
          <a href="#" className="hover:text-white">Privacy</a>
          <a href="#" className="hover:text-white">Terms</a>
          <a href="#" className="hover:text-white">Contact</a>
        </div>
      </div>
    </footer>
  );
}