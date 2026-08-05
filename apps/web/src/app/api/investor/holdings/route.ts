import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const commitment = searchParams.get('commitment') ?? '';

  if (!commitment) {
    return NextResponse.json(
      { success: false, error: 'Missing commitment parameter', timestamp: new Date().toISOString() },
      { status: 400 }
    );
  }

  const holdings = await db.getHoldingsByCommitment(commitment);
  return NextResponse.json({ success: true, data: holdings, timestamp: new Date().toISOString() });
}
