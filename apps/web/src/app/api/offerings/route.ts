import { NextResponse } from 'next/server';
import { listOfferingsServerless, createOfferingServerless } from '@/lib/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || undefined;
  const status = searchParams.get('status') || undefined;
  const search = searchParams.get('search') || undefined;
  const page = searchParams.get('page') ? Number(searchParams.get('page')) : undefined;
  const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined;
  const sortBy = searchParams.get('sortBy') || undefined;

  const data = listOfferingsServerless({
    category: category as any,
    status: status as any,
    search,
    page,
    limit,
    sortBy: sortBy as any,
  });

  return NextResponse.json({
    success: true,
    data,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const offering = createOfferingServerless(body);
    return NextResponse.json(
      {
        success: true,
        data: offering,
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
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
