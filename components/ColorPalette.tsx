'use client';

interface ColorPaletteProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

const PALETTE_GROUPS: { name: string; colors: string[] }[] = [
  {
    name: 'Neons',
    colors: ['#ff2d87', '#ff6b2b', '#ffed4a', '#00ff87', '#00d4ff', '#a855f7'],
  },
  {
    name: 'Warm',
    colors: ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#fbbf24', '#fcd34d'],
  },
  {
    name: 'Cool',
    colors: ['#06b6d4', '#0891b2', '#3b82f6', '#6366f1', '#8b5cf6', '#a78bfa'],
  },
  {
    name: 'Nature',
    colors: ['#22c55e', '#16a34a', '#15803d', '#84cc16', '#a3e635', '#4ade80'],
  },
  {
    name: 'Earth',
    colors: ['#92400e', '#a16207', '#ca8a04', '#d97706', '#b45309', '#78350f'],
  },
  {
    name: 'Pastels',
    colors: ['#fda4af', '#fdba74', '#fde68a', '#86efac', '#93c5fd', '#d8b4fe'],
  },
  {
    name: 'Neutrals',
    colors: ['#ffffff', '#e5e7eb', '#9ca3af', '#6b7280', '#374151', '#111827'],
  },
  {
    name: 'Pinks',
    colors: ['#fce7f3', '#fbcfe8', '#f9a8d4', '#f472b6', '#ec4899', '#db2777'],
  },
];

export default function ColorPalette({ selectedColor, onSelectColor }: ColorPaletteProps) {
  return (
    <div className="space-y-3">
      {PALETTE_GROUPS.map((group) => (
        <div key={group.name}>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1.5">
            {group.name}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {group.colors.map((color) => (
              <button
                key={color}
                onClick={() => onSelectColor(color)}
                className={`w-8 h-8 rounded-lg transition-all duration-150 border-2 hover:scale-110 ${
                  selectedColor === color
                    ? 'border-white scale-110 shadow-lg shadow-white/20'
                    : 'border-transparent hover:border-gray-500'
                }`}
                style={{ backgroundColor: color }}
                title={color}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}