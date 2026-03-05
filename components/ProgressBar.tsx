import type { BillboardStats } from '@/types';

interface ProgressBarProps {
  stats: BillboardStats;
}

export default function ProgressBar({ stats }: ProgressBarProps) {
  const isComplete = stats.percentage >= 100;

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-2 text-sm">
        <span className="text-gray-400">
          <span className="text-white font-bold">{stats.designed.toLocaleString()}</span>{' '}
          / {stats.total.toLocaleString()} pixels
        </span>
        <span className={`font-bold font-mono ${isComplete ? 'text-neon-green' : 'text-canvas-400'}`}>
          {stats.percentage}%
        </span>
      </div>

      <div className="w-full h-3 bg-canvas-900 rounded-full overflow-hidden border border-canvas-800">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
          style={{
            width: `${Math.min(stats.percentage, 100)}%`,
            background: isComplete
              ? 'linear-gradient(90deg, #00ff87, #00d4ff, #a855f7, #ff2d87)'
              : 'linear-gradient(90deg, #5b65f5, #00d4ff)',
          }}
        >
          <div className="absolute inset-0 shimmer-bg" />
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 mt-3 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-neon-green" />
          {stats.designed.toLocaleString()} designed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-neon-yellow" />
          {stats.locked.toLocaleString()} in progress
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-canvas-700" />
          {stats.available.toLocaleString()} available
        </span>
      </div>
    </div>
  );
}