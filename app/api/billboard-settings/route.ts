import { NextResponse } from 'next/server';
import { getBillboardSettings, getAllPixels, buildPixelMap, calculateStats } from '@/lib/cosmic';

export async function GET() {
  try {
    const [settings, pixels] = await Promise.all([
      getBillboardSettings(),
      getAllPixels(),
    ]);

    const columns = settings?.metadata?.grid_columns ?? 100;
    const rows = settings?.metadata?.grid_rows ?? 100;
    const totalPixels = columns * rows;
    const pixelMap = buildPixelMap(pixels);
    const stats = calculateStats(pixelMap, totalPixels);

    return NextResponse.json({
      settings: settings || null,
      stats,
      pixelCount: pixels.length,
    });
  } catch (error) {
    console.error('Error fetching billboard settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch billboard settings' },
      { status: 500 }
    );
  }
}