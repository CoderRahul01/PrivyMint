import type { NextRequest } from 'next/server';

// This file is intentionally minimal. Route-level middleware can be added here as the platform scales.
export function middleware(_request: NextRequest) {
  // Future: Add authentication checks, network redirects, and rate limiting headers here.
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
