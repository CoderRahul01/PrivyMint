import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const snapshot = await db.getAnalyticsSnapshot();
  return NextResponse.json({
    success: true,
    data: snapshot,
    timestamp: new Date().toISOString(),
  });
}
