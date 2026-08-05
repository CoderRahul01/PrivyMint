import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { trackServerEvent } from '@/lib/posthog-server';

const TransferSharesSchema = z.object({
  senderCommitment: z.string().min(6),
  recipientCommitment: z.string().min(6),
  offeringId: z.string().uuid(),
  shares: z.number().int().positive(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { senderCommitment, recipientCommitment, offeringId, shares } = TransferSharesSchema.parse(body);
    const result = await db.recordShareTransfer(senderCommitment, recipientCommitment, offeringId, shares);

    trackServerEvent(senderCommitment, 'share_transferred', {
      offeringId,
      shares,
      recipientCommitment,
    });

    return NextResponse.json({ success: true, data: result, timestamp: new Date().toISOString() });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Invalid request', timestamp: new Date().toISOString() },
      { status: 400 }
    );
  }
}
