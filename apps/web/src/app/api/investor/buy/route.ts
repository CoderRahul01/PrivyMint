import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { trackServerEvent } from '@/lib/posthog-server';

const BuySharesSchema = z.object({
  commitment: z.string().min(6),
  offeringId: z.string().uuid(),
  sharesToBuy: z.number().int().positive(),
  address: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { commitment, offeringId, sharesToBuy, address } = BuySharesSchema.parse(body);
    const result = await db.recordSharePurchase(commitment, offeringId, sharesToBuy);

    trackServerEvent(commitment, 'share_purchased', {
      offeringId,
      sharesToBuy,
      totalAmountDust: result.transaction.amountDust,
      address,
    });

    return NextResponse.json(
      { success: true, data: result, timestamp: new Date().toISOString() },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Invalid request', timestamp: new Date().toISOString() },
      { status: 400 }
    );
  }
}
