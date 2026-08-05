import { NextResponse } from 'next/server';
import { generateAiTelemetryReport } from '@/lib/ai-telemetry';

export async function GET() {
  const report = await generateAiTelemetryReport();
  return NextResponse.json({ success: true, data: report, timestamp: new Date().toISOString() });
}
