import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// In-memory rate limiting map.
// Note: In an edge computing environment (like Vercel), this state is isolated per region/isolate.
// It acts as a "soft" rate limit against basic abuse, which is sufficient for zero-dependency setups.
const ipMap = new Map<string, { count: number; timestamp: number }>();

const RATE_LIMIT = 30; // Max requests
const WINDOW_MS = 60 * 1000; // 1 minute

export function middleware(request: NextRequest) {
  // We only rate-limit mutations (POST, PUT, DELETE)
  // This protects Server Actions (which use POST) and API routes
  // while allowing uninterrupted GET requests for page navigation.
  if (
    request.method !== 'POST' &&
    request.method !== 'PUT' &&
    request.method !== 'DELETE'
  ) {
    return NextResponse.next();
  }

  // Attempt to reliably extract the client's IP address
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1';

  const now = Date.now();
  const record = ipMap.get(ip);

  // If this is their first request, initialize their record
  if (!record) {
    ipMap.set(ip, { count: 1, timestamp: now });
    return NextResponse.next();
  }

  // If the time window has passed, reset their count
  if (now - record.timestamp > WINDOW_MS) {
    ipMap.set(ip, { count: 1, timestamp: now });
    return NextResponse.next();
  }

  // Increment the request count
  record.count += 1;

  // Enforce the rate limit
  if (record.count > RATE_LIMIT) {
    return new NextResponse('Too Many Requests. Please slow down.', {
      status: 429,
      headers: {
        'Retry-After': Math.ceil(WINDOW_MS / 1000).toString(),
      },
    });
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
