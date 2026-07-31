import { NextResponse } from 'next/server';
import { getOfferingByIdServerless } from '@/lib/store';

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const offering = getOfferingByIdServerless(id);

  if (!offering) {
    return NextResponse.json(
      {
        success: false,
        error: 'Offering not found',
        timestamp: new Date().toISOString(),
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: offering,
    timestamp: new Date().toISOString(),
  });
}
