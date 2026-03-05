import { NextResponse } from 'next/server';
import { lockPixel } from '@/lib/cosmic';
import { moderateText } from '@/lib/moderation';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      x?: number;
      y?: number;
      sessionId?: string;
    };

    const { x, y, sessionId } = body;

    if (x === undefined || y === undefined || !sessionId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: x, y, sessionId' },
        { status: 400 }
      );
    }

    if (typeof x !== 'number' || typeof y !== 'number') {
      return NextResponse.json(
        { success: false, error: 'x and y must be numbers' },
        { status: 400 }
      );
    }

    if (x < 0 || x >= 100 || y < 0 || y >= 100) {
      return NextResponse.json(
        { success: false, error: 'Pixel coordinates out of range' },
        { status: 400 }
      );
    }

    // Moderate session ID (in case of injection)
    const sessionModeration = moderateText(sessionId);
    if (!sessionModeration.approved) {
      return NextResponse.json(
        { success: false, error: 'Invalid session.' },
        { status: 400 }
      );
    }

    const result = await lockPixel(x, y, sessionId);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in lock pixel API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}