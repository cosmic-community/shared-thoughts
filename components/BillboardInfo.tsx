import type { BillboardStats } from '@/types';

interface BillboardInfoProps {
  stats: BillboardStats;
}

export default function BillboardInfo({ stats }: BillboardInfoProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
      <div className="glass-panel rounded-xl px-4 py-2 text-center">
        <p className="text-xs text-gray-500 uppercase tracking-wider">Total Pixels</p>
        <p className="text-lg font-bold text-white font-mono">
          {stats.total.toLocaleString()}
        </p>
      </div>
      <div className="glass-panel rounded-xl px-4 py-2 text-center">
        <p className="text-xs text-gray-500 uppercase tracking-wider">Designed</p>
        <p className="text-lg font-bold text-neon-green font-mono">
          {stats.designed.toLocaleString()}
        </p>
      </div>
      <div className="glass-panel rounded-xl px-4 py-2 text-center">
        <p className="text-xs text-gray-500 uppercase tracking-wider">In Progress</p>
        <p className="text-lg font-bold text-neon-yellow font-mono">
          {stats.locked.toLocaleString()}
        </p>
      </div>
      <div className="glass-panel rounded-xl px-4 py-2 text-center">
        <p className="text-xs text-gray-500 uppercase tracking-wider">Available</p>
        <p className="text-lg font-bold text-canvas-400 font-mono">
          {stats.available.toLocaleString()}
        </p>
      </div>

      <div className="w-full text-center mt-2">
        <p className="text-sm text-gray-500">
          💡 Click any dark pixel to claim and design it. Zoom with scroll or pinch.
        </p>
      </div>
    </div>
  );
}