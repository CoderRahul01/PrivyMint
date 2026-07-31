import { NextResponse } from 'next/server';
import { saveOnboardingEventServerless } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    saveOnboardingEventServerless(body);
    return NextResponse.json(
      {
        success: true,
        data: { tracked: true },
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
