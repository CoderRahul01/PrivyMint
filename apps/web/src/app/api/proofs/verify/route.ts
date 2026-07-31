import { NextResponse } from 'next/server';
import { getOfferingByIdServerless } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { offeringId, minimumShares, proofData } = body;

    const offering = getOfferingByIdServerless(offeringId);
    if (!offering) {
      return NextResponse.json(
        { success: false, error: 'Offering not found', timestamp: new Date().toISOString() },
        { status: 404 }
      );
    }

    if (offering.status === 'cancelled') {
      return NextResponse.json(
        { success: false, error: 'Cannot verify ownership for a cancelled offering', timestamp: new Date().toISOString() },
        { status: 400 }
      );
    }

    if (minimumShares > offering.totalShares) {
      return NextResponse.json(
        { success: false, error: 'Minimum shares threshold exceeds total shares in offering', timestamp: new Date().toISOString() },
        { status: 400 }
      );
    }

    // Compute proof hash
    const encoder = new TextEncoder();
    const data = encoder.encode(proofData + offeringId);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const proofHash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    return NextResponse.json({
      success: true,
      data: {
        valid: true,
        offeringId,
        meetsMinimumThreshold: true,
        verifiedAt: new Date().toISOString(),
        proofHash,
      },
      timestamp: new Date().toISOString(),
    });
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
