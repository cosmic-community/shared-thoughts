// app/api/pixels/[id]/route.ts
import { NextResponse } from 'next/server';
import { savePixel, releasePixel } from '@/lib/cosmic';
import { moderateText, moderateColor } from '@/lib/moderation';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = (await request.json()) as {
      color?: string;
      creatorName?: string;
      sessionId?: string;
    };

    const { color, creatorName, sessionId } = body;

    if (!color || !sessionId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: color, sessionId' },
        { status: 400 }
      );
    }

    // Moderate the color
    const colorModeration = moderateColor(color);
    if (!colorModeration.approved) {
      return NextResponse.json(
        { success: false, error: colorModeration.reason },
        { status: 400 }
      );
    }

    // Moderate the creator name
    if (creatorName) {
      const nameModeration = moderateText(creatorName);
      if (!nameModeration.approved) {
        return NextResponse.json(
          { success: false, error: nameModeration.reason },
          { status: 400 }
        );
      }
    }

    const result = await savePixel(id, color, creatorName || 'Anonymous', sessionId);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in save pixel API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = (await request.json()) as { sessionId?: string };
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Missing sessionId' },
        { status: 400 }
      );
    }

    const result = await releasePixel(id, sessionId);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in release pixel API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}