import { createBucketClient } from '@cosmicjs/sdk';
import type { BillboardSettings, Pixel, PixelMap, BillboardStats } from '@/types';

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
});

function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

export function getMetafieldValue(field: unknown): string {
  if (field === null || field === undefined) return '';
  if (typeof field === 'string') return field;
  if (typeof field === 'number' || typeof field === 'boolean') return String(field);
  if (typeof field === 'object' && field !== null && 'value' in field) {
    return String((field as { value: unknown }).value);
  }
  if (typeof field === 'object' && field !== null && 'key' in field) {
    return String((field as { key: unknown }).key);
  }
  return '';
}

export async function getBillboardSettings(): Promise<BillboardSettings | null> {
  try {
    const response = await cosmic.objects
      .find({ type: 'billboard-settings' })
      .props(['id', 'slug', 'title', 'metadata'])
      .depth(1);

    const settings = response.objects[0];
    if (!settings) return null;
    return settings as BillboardSettings;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    console.error('Error fetching billboard settings:', error);
    return null;
  }
}

export async function getAllPixels(): Promise<Pixel[]> {
  const allPixels: Pixel[] = [];
  let skip = 0;
  const limit = 100;

  try {
    while (true) {
      const response = await cosmic.objects
        .find({ type: 'pixels' })
        .props(['id', 'slug', 'title', 'metadata', 'created_at', 'modified_at'])
        .skip(skip)
        .limit(limit)
        .depth(1);

      const pixels = response.objects as Pixel[];
      if (!pixels || pixels.length === 0) break;

      allPixels.push(...pixels);

      if (pixels.length < limit) break;
      skip += limit;
    }
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    console.error('Error fetching pixels:', error);
  }

  return allPixels;
}

export function buildPixelMap(pixels: Pixel[]): PixelMap {
  const map: PixelMap = {};
  for (const pixel of pixels) {
    const x = pixel.metadata?.grid_x;
    const y = pixel.metadata?.grid_y;
    if (x !== undefined && y !== undefined) {
      map[`${x}-${y}`] = pixel;
    }
  }
  return map;
}

export function calculateStats(pixelMap: PixelMap, totalPixels: number): BillboardStats {
  let designed = 0;
  let locked = 0;

  for (const key of Object.keys(pixelMap)) {
    const pixel = pixelMap[key];
    if (!pixel) continue;
    const status = getMetafieldValue(pixel.metadata?.pixel_status);
    if (status === 'Designed') {
      designed++;
    } else if (status === 'Locked') {
      locked++;
    }
  }

  return {
    total: totalPixels,
    designed,
    available: totalPixels - designed - locked,
    locked,
    percentage: Math.round((designed / totalPixels) * 100),
  };
}

export async function lockPixel(
  x: number,
  y: number,
  sessionId: string
): Promise<{ success: boolean; pixelId?: string; error?: string }> {
  try {
    // Check if pixel already exists
    const existingResponse = await cosmic.objects
      .find({
        type: 'pixels',
        'metadata.grid_x': x,
        'metadata.grid_y': y,
      })
      .props(['id', 'slug', 'title', 'metadata'])
      .depth(1);

    const existing = existingResponse.objects[0] as Pixel | undefined;

    if (existing) {
      const status = getMetafieldValue(existing.metadata?.pixel_status);

      if (status === 'Designed') {
        return { success: false, error: 'This pixel has already been designed.' };
      }

      if (status === 'Locked') {
        const lockedBy = getMetafieldValue(existing.metadata?.locked_by_session);
        if (lockedBy === sessionId) {
          return { success: true, pixelId: existing.id };
        }

        // Check lock timeout (10 minutes)
        const lockedAt = getMetafieldValue(existing.metadata?.locked_at);
        if (lockedAt) {
          const lockTime = new Date(lockedAt).getTime();
          const now = Date.now();
          const timeoutMs = 10 * 60 * 1000;
          if (now - lockTime < timeoutMs) {
            return { success: false, error: 'This pixel is currently being edited by someone else.' };
          }
        }
      }

      // Update existing pixel to lock it
      await cosmic.objects.updateOne(existing.id, {
        metadata: {
          pixel_status: 'Locked',
          locked_by_session: sessionId,
          locked_at: new Date().toISOString(),
        },
      });

      return { success: true, pixelId: existing.id };
    }

    // Create new pixel
    const newPixel = await cosmic.objects.insertOne({
      type: 'pixels',
      title: `Pixel ${x}-${y}`,
      metadata: {
        grid_x: x,
        grid_y: y,
        pixel_color: '#1a1a2e',
        pixel_status: 'Locked',
        locked_by_session: sessionId,
        locked_at: new Date().toISOString(),
        creator_name: '',
        moderation_status: 'Pending',
        pixel_data: '',
      },
    });

    return { success: true, pixelId: newPixel.object.id };
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      // No existing pixel, create new one
      try {
        const newPixel = await cosmic.objects.insertOne({
          type: 'pixels',
          title: `Pixel ${x}-${y}`,
          metadata: {
            grid_x: x,
            grid_y: y,
            pixel_color: '#1a1a2e',
            pixel_status: 'Locked',
            locked_by_session: sessionId,
            locked_at: new Date().toISOString(),
            creator_name: '',
            moderation_status: 'Pending',
            pixel_data: '',
          },
        });
        return { success: true, pixelId: newPixel.object.id };
      } catch (createError) {
        console.error('Error creating pixel:', createError);
        return { success: false, error: 'Failed to create pixel.' };
      }
    }
    console.error('Error locking pixel:', error);
    return { success: false, error: 'Failed to lock pixel.' };
  }
}

export async function savePixel(
  pixelId: string,
  color: string,
  creatorName: string,
  sessionId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await cosmic.objects.updateOne(pixelId, {
      metadata: {
        pixel_color: color,
        pixel_status: 'Designed',
        creator_name: creatorName || 'Anonymous',
        moderation_status: 'Approved',
        locked_by_session: '',
        locked_at: '',
      },
    });

    // Log the action
    try {
      await cosmic.objects.insertOne({
        type: 'pixel-logs',
        title: `Pixel designed - ${pixelId}`,
        metadata: {
          pixel_reference: pixelId,
          action: 'designed',
          session_id: sessionId,
          details: `Color: ${color}, Creator: ${creatorName || 'Anonymous'}`,
        },
      });
    } catch {
      // Logging failure shouldn't block save
    }

    return { success: true };
  } catch (error) {
    console.error('Error saving pixel:', error);
    return { success: false, error: 'Failed to save pixel.' };
  }
}

export async function releasePixel(
  pixelId: string,
  sessionId: string
): Promise<{ success: boolean }> {
  try {
    await cosmic.objects.updateOne(pixelId, {
      metadata: {
        pixel_status: 'Available',
        locked_by_session: '',
        locked_at: '',
      },
    });
    return { success: true };
  } catch (error) {
    console.error('Error releasing pixel:', error);
    return { success: false };
  }
}