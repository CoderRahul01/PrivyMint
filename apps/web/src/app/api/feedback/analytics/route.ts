import { NextResponse } from 'next/server';
import { getAnalyticsSnapshotServerless } from '@/lib/store';

export async function GET() {
  const snapshot = getAnalyticsSnapshotServerless();
  return NextResponse.json({
    success: true,
    data: snapshot,
    timestamp: new Date().toISOString(),
  });
}
