import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const commitment = searchParams.get('commitment') ?? undefined;
  const transactions = await db.getTransactions(commitment);
  return NextResponse.json({ success: true, data: transactions, timestamp: new Date().toISOString() });
}
