import { NextResponse } from 'next/server';
import { calculateDauMetrics } from '@/lib/ai-telemetry';

export async function GET() {
  const metrics = await calculateDauMetrics();
  return NextResponse.json({ success: true, data: metrics, timestamp: new Date().toISOString() });
}
