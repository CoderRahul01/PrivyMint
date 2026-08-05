import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { trackServerEvent } from '@/lib/posthog-server';

const TelemetryEventSchema = z.object({
  eventName: z.string().min(1),
  sessionId: z.string().min(1),
  commitment: z.string().optional(),
  payload: z.record(z.any()).default({}),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventName, sessionId, commitment, payload } = TelemetryEventSchema.parse(body);
    const eventRecord = await db.recordTelemetryEvent(eventName, sessionId, payload, commitment);

    if (commitment) {
      trackServerEvent(commitment, eventName, payload);
    }

    return NextResponse.json(
      { success: true, data: eventRecord, timestamp: new Date().toISOString() },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Invalid request', timestamp: new Date().toISOString() },
      { status: 400 }
    );
  }
}
