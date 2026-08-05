import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await db.saveFeedback(body);
    return NextResponse.json(
      {
        success: true,
        data: { received: true, message: 'Thank you for your feedback!' },
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : 'Invalid request',
        timestamp: new Date().toISOString(),
      },
      { status: 400 }
    );
  }
}
