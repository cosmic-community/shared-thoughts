'use client';

import { useState, useCallback } from 'react';
import ColorPalette from '@/components/ColorPalette';

interface PixelEditorProps {
  x: number;
  y: number;
  pixelId: string;
  currentColor: string;
  onSave: (color: string, creatorName: string) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}

export default function PixelEditor({
  x,
  y,
  pixelId,
  currentColor,
  onSave,
  onCancel,
  isSaving,
}: PixelEditorProps) {
  const [color, setColor] = useState(currentColor === '#1a1a2e' ? '#ff2d87' : currentColor);
  const [customColor, setCustomColor] = useState(color);
  const [creatorName, setCreatorName] = useState('');
  const [error, setError] = useState('');

  const handleCustomColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCustomColor(newColor);
    setColor(newColor);
  }, []);

  const handleSave = async () => {
    setError('');

    if (!color) {
      setError('Please select a color.');
      return;
    }

    // Basic name moderation
    if (creatorName.length > 50) {
      setError('Name is too long. Maximum 50 characters.');
      return;
    }

    try {
      await onSave(color, creatorName);
    } catch {
      setError('Failed to save. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md glass-panel rounded-2xl overflow-hidden border border-canvas-700 animate-float" style={{ animationIterationCount: 1 }}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-canvas-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Design Your Pixel</h2>
            <p className="text-sm text-gray-400 font-mono mt-0.5">
              Position ({x}, {y})
            </p>
          </div>
          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-lg bg-canvas-800 hover:bg-canvas-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            aria-label="Close editor"
          >
            ✕
          </button>
        </div>

        {/* Preview */}
        <div className="px-6 pt-4 flex items-center gap-4">
          <div
            className="w-20 h-20 rounded-xl border-2 border-canvas-700 shadow-lg transition-colors duration-200"
            style={{ backgroundColor: color }}
          />
          <div>
            <p className="text-sm text-gray-400">Preview</p>
            <p className="text-lg font-mono font-bold text-white">{color}</p>
            <p className="text-xs text-gray-500 mt-1">
              This is how your pixel will look on the billboard
            </p>
          </div>
        </div>

        {/* Color picker */}
        <div className="px-6 py-4 space-y-4 max-h-[400px] overflow-y-auto scrollbar-hide">
          {/* Custom color input */}
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1.5">
              Custom Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={customColor}
                onChange={handleCustomColorChange}
                className="w-12 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => {
                  const val = e.target.value;
                  setColor(val);
                  if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                    setCustomColor(val);
                  }
                }}
                className="flex-1 bg-canvas-900 border border-canvas-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-canvas-500"
                placeholder="#FF2D87"
                maxLength={7}
              />
            </div>
          </div>

          {/* Palette */}
          <ColorPalette selectedColor={color} onSelectColor={setColor} />

          {/* Creator name */}
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1.5">
              Your Name (optional)
            </label>
            <input
              type="text"
              value={creatorName}
              onChange={(e) => setCreatorName(e.target.value)}
              className="w-full bg-canvas-900 border border-canvas-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-canvas-500"
              placeholder="Anonymous"
              maxLength={50}
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-900/20 border border-red-800/30 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-canvas-800 flex items-center gap-3">
          <button
            onClick={onCancel}
            disabled={isSaving}
            className="flex-1 px-4 py-2.5 rounded-xl bg-canvas-800 hover:bg-canvas-700 text-gray-300 font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-neon-pink to-neon-purple hover:from-neon-pink/90 hover:to-neon-purple/90 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-wait"
          >
            {isSaving ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              '💾 Save Pixel'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}