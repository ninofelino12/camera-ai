import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Skip protection for API routes and static assets
  if (
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Check for access password if enabled
  const accessPassword = process.env.ACCESS_PASSWORD;
  
  if (accessPassword) {
    const passwordCookie = request.cookies.get('access_password')?.value;
    
    // If password is set and cookie doesn't match, redirect to password page
    if (passwordCookie !== accessPassword) {
      if (request.nextUrl.pathname !== '/access-password') {
        return NextResponse.redirect(new URL('/access-password', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};
