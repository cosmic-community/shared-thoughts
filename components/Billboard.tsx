'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import PixelEditor from '@/components/PixelEditor';
import type { PixelMap, Pixel } from '@/types';
import { getSessionId } from '@/lib/session';

interface BillboardProps {
  columns: number;
  rows: number;
  initialPixelMap: PixelMap;
}

const DEFAULT_COLOR = '#0f0e2e';
const LOCKED_COLOR = '#2d2b84';

export default function Billboard({ columns, rows, initialPixelMap }: BillboardProps) {
  const [pixelMap, setPixelMap] = useState<PixelMap>(initialPixelMap);
  const [selectedPixel, setSelectedPixel] = useState<{
    x: number;
    y: number;
    pixelId: string;
    color: string;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLocking, setIsLocking] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const sessionId = useMemo(() => {
    if (typeof window !== 'undefined') {
      return getSessionId();
    }
    return '';
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const handlePixelClick = useCallback(
    async (x: number, y: number) => {
      if (selectedPixel || isLocking) return;

      const key = `${x}-${y}`;
      const pixel = pixelMap[key];
      const status = pixel?.metadata?.pixel_status;

      if (typeof status === 'string' && status === 'Designed') {
        const creator = pixel?.metadata?.creator_name || 'Anonymous';
        const color = pixel?.metadata?.pixel_color || '#000000';
        showToast(`This pixel was designed by ${creator} (${color})`, 'success');
        return;
      }

      if (typeof status === 'string' && status === 'Locked') {
        const lockedBy = pixel?.metadata?.locked_by_session;
        if (lockedBy !== sessionId) {
          showToast('This pixel is being edited by someone else.', 'error');
          return;
        }
      }

      setIsLocking(true);

      try {
        const response = await fetch('/api/pixels/lock', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ x, y, sessionId }),
        });

        const data = await response.json() as { success: boolean; pixelId?: string; error?: string };

        if (!data.success) {
          showToast(data.error || 'Failed to claim pixel.', 'error');
          setIsLocking(false);
          return;
        }

        setSelectedPixel({
          x,
          y,
          pixelId: data.pixelId || '',
          color: pixel?.metadata?.pixel_color as string || DEFAULT_COLOR,
        });

        // Update local pixel map to show locked state
        setPixelMap((prev) => ({
          ...prev,
          [key]: {
            ...(prev[key] || {
              id: data.pixelId || '',
              slug: `pixel-${x}-${y}`,
              title: `Pixel ${x}-${y}`,
              type: 'pixels',
              created_at: new Date().toISOString(),
              modified_at: new Date().toISOString(),
            }),
            metadata: {
              ...(prev[key]?.metadata || {}),
              grid_x: x,
              grid_y: y,
              pixel_status: 'Locked',
              locked_by_session: sessionId,
            },
          } as Pixel,
        }));
      } catch {
        showToast('Failed to claim pixel. Please try again.', 'error');
      } finally {
        setIsLocking(false);
      }
    },
    [selectedPixel, isLocking, pixelMap, sessionId, showToast]
  );

  const handleSave = useCallback(
    async (color: string, creatorName: string) => {
      if (!selectedPixel) return;
      setIsSaving(true);

      try {
        const response = await fetch(`/api/pixels/${selectedPixel.pixelId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ color, creatorName, sessionId }),
        });

        const data = await response.json() as { success: boolean; error?: string };

        if (!data.success) {
          showToast(data.error || 'Failed to save pixel.', 'error');
          setIsSaving(false);
          return;
        }

        const key = `${selectedPixel.x}-${selectedPixel.y}`;
        setPixelMap((prev) => ({
          ...prev,
          [key]: {
            ...(prev[key] || {
              id: selectedPixel.pixelId,
              slug: `pixel-${selectedPixel.x}-${selectedPixel.y}`,
              title: `Pixel ${selectedPixel.x}-${selectedPixel.y}`,
              type: 'pixels',
              created_at: new Date().toISOString(),
              modified_at: new Date().toISOString(),
            }),
            metadata: {
              ...(prev[key]?.metadata || {}),
              grid_x: selectedPixel.x,
              grid_y: selectedPixel.y,
              pixel_color: color,
              pixel_status: 'Designed',
              creator_name: creatorName || 'Anonymous',
              moderation_status: 'Approved',
              locked_by_session: '',
            },
          } as Pixel,
        }));

        setSelectedPixel(null);
        showToast('🎉 Your pixel has been saved!', 'success');
      } catch {
        showToast('Failed to save. Please try again.', 'error');
      } finally {
        setIsSaving(false);
      }
    },
    [selectedPixel, sessionId, showToast]
  );

  const handleCancel = useCallback(async () => {
    if (!selectedPixel) return;

    try {
      await fetch(`/api/pixels/${selectedPixel.pixelId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });

      const key = `${selectedPixel.x}-${selectedPixel.y}`;
      setPixelMap((prev) => {
        const updated = { ...prev };
        const existing = updated[key];
        if (existing) {
          updated[key] = {
            ...existing,
            metadata: {
              ...existing.metadata,
              pixel_status: 'Available',
              locked_by_session: '',
            },
          } as Pixel;
        }
        return updated;
      });
    } catch {
      // Silent failure for release
    }

    setSelectedPixel(null);
  }, [selectedPixel, sessionId]);

  // Zoom controls
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.15 : 0.15;
      setZoom((prev) => Math.max(0.3, Math.min(8, prev + delta)));
    },
    []
  );

  // Pan controls
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button === 1 || (e.button === 0 && e.altKey)) {
        e.preventDefault();
        setIsPanning(true);
        panStartRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
      }
    },
    [panOffset]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isPanning) {
        setPanOffset({
          x: e.clientX - panStartRef.current.x,
          y: e.clientY - panStartRef.current.y,
        });
      }
    },
    [isPanning]
  );

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsPanning(false);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  // Calculate pixel size based on container
  const pixelSize = Math.max(4, Math.min(8, Math.floor(700 / columns)));

  // Build the grid as a canvas-like structure
  const gridRows = useMemo(() => {
    const rowElements: React.ReactNode[] = [];
    for (let y = 0; y < rows; y++) {
      const cells: React.ReactNode[] = [];
      for (let x = 0; x < columns; x++) {
        const key = `${x}-${y}`;
        const pixel = pixelMap[key];
        const status = typeof pixel?.metadata?.pixel_status === 'string'
          ? pixel.metadata.pixel_status
          : '';
        const color =
          status === 'Designed'
            ? (pixel?.metadata?.pixel_color as string) || DEFAULT_COLOR
            : status === 'Locked'
            ? LOCKED_COLOR
            : DEFAULT_COLOR;

        const isDesigned = status === 'Designed';
        const isLocked = status === 'Locked';

        cells.push(
          <div
            key={key}
            className={`pixel-grid-cell cursor-pointer inline-block ${
              isDesigned ? '' : isLocked ? 'opacity-70' : 'hover:opacity-80'
            }`}
            style={{
              width: pixelSize,
              height: pixelSize,
              backgroundColor: color,
            }}
            onClick={() => handlePixelClick(x, y)}
            title={
              isDesigned
                ? `(${x},${y}) by ${pixel?.metadata?.creator_name || 'Anonymous'}`
                : isLocked
                ? `(${x},${y}) - Being edited`
                : `(${x},${y}) - Available`
            }
          />
        );
      }
      rowElements.push(
        <div key={`row-${y}`} className="flex" style={{ height: pixelSize }}>
          {cells}
        </div>
      );
    }
    return rowElements;
  }, [columns, rows, pixelMap, pixelSize, handlePixelClick]);

  return (
    <div className="relative">
      {/* Zoom controls */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <button
          onClick={() => setZoom((z) => Math.max(0.3, z - 0.3))}
          className="w-9 h-9 rounded-lg bg-canvas-900 border border-canvas-700 hover:bg-canvas-800 text-white flex items-center justify-center font-bold transition-colors"
          aria-label="Zoom out"
        >
          −
        </button>
        <span className="text-sm font-mono text-gray-400 w-16 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom((z) => Math.min(8, z + 0.3))}
          className="w-9 h-9 rounded-lg bg-canvas-900 border border-canvas-700 hover:bg-canvas-800 text-white flex items-center justify-center font-bold transition-colors"
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          onClick={() => {
            setZoom(1);
            setPanOffset({ x: 0, y: 0 });
          }}
          className="px-3 h-9 rounded-lg bg-canvas-900 border border-canvas-700 hover:bg-canvas-800 text-gray-400 text-xs font-medium transition-colors"
        >
          Reset
        </button>
        <span className="text-xs text-gray-600 hidden sm:inline">
          Alt+Drag to pan
        </span>
      </div>

      {/* Billboard container */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-2xl border border-canvas-800 bg-canvas-950 cursor-crosshair"
        style={{ height: '70vh', minHeight: 400 }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div
          className="absolute"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            left: '50%',
            top: '50%',
            marginLeft: -(columns * pixelSize) / 2,
            marginTop: -(rows * pixelSize) / 2,
          }}
        >
          {gridRows}
        </div>

        {/* Loading overlay for locking */}
        {isLocking && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-20">
            <div className="glass-panel rounded-xl px-6 py-3 flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-neon-blue/30 border-t-neon-blue rounded-full animate-spin" />
              <span className="text-white font-medium">Claiming pixel...</span>
            </div>
          </div>
        )}
      </div>

      {/* Pixel Editor Modal */}
      {selectedPixel && (
        <PixelEditor
          x={selectedPixel.x}
          y={selectedPixel.y}
          pixelId={selectedPixel.pixelId}
          currentColor={selectedPixel.color}
          onSave={handleSave}
          onCancel={handleCancel}
          isSaving={isSaving}
        />
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl font-medium text-sm shadow-2xl transition-all ${
            toast.type === 'success'
              ? 'bg-neon-green/20 text-neon-green border border-neon-green/30'
              : 'bg-red-900/30 text-red-400 border border-red-800/30'
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}