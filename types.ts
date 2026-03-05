export interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, unknown>;
  type: string;
  created_at: string;
  modified_at: string;
}

export interface BillboardSettings extends CosmicObject {
  type: 'billboard-settings';
  metadata: {
    billboard_title?: string;
    description?: string;
    grid_columns?: number;
    grid_rows?: number;
    billboard_status?: string;
    background_color?: string;
    moderation_enabled?: boolean;
    lock_timeout_minutes?: number;
  };
}

export interface Pixel extends CosmicObject {
  type: 'pixels';
  metadata: {
    grid_x?: number;
    grid_y?: number;
    pixel_color?: string;
    pixel_status?: string;
    locked_by_session?: string;
    locked_at?: string;
    creator_name?: string;
    moderation_status?: string;
    pixel_data?: string;
  };
}

export interface PixelLog extends CosmicObject {
  type: 'pixel-logs';
  metadata: {
    pixel_reference?: string;
    action?: string;
    session_id?: string;
    details?: string;
  };
}

export interface PixelMap {
  [key: string]: Pixel;
}

export interface BillboardStats {
  total: number;
  designed: number;
  available: number;
  locked: number;
  percentage: number;
}

export interface PixelCoord {
  x: number;
  y: number;
}

export type PixelStatus = 'Available' | 'Locked' | 'Designed';
export type ModerationStatus = 'Pending' | 'Approved' | 'Rejected';