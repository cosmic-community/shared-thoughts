import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-canvas-800/50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-neon-pink via-neon-purple to-neon-blue flex items-center justify-center text-lg transition-transform group-hover:scale-110">
            🎨
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Shared<span className="text-canvas-400">Thoughts</span>
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          <span className="hidden sm:inline text-sm text-gray-400">
            10,000 pixels · 1 masterpiece
          </span>
          <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse-slow" />
          <span className="text-xs text-gray-500 font-mono">LIVE</span>
        </nav>
      </div>
    </header>
  );
}