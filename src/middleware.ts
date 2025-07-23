import { NextRequest, NextResponse } from 'next/server';

/**
 * Protected routes that require authentication
 */
const PROTECTED_ROUTES = [
  '/',
  '/dashboard',
  '/campaigns',
  '/orders',
  '/products',
  '/profile',
];

/**
 * Routes that should redirect authenticated users away
 */
const AUTH_ROUTES = [
  '/login',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/verify-code' // Added
];

/**
 * Authentication middleware
 * Handles route protection and redirects based on authentication status
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(
    process.env.NEXT_PUBLIC_TOKEN_COOKIE_NAME || 'accessToken'
  );

  const isAuthenticated = !!token;
  const isProtectedRoute = PROTECTED_ROUTES.some(route =>
    pathname.startsWith(route)
  );
  const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));

  // If user is not authenticated and trying to access protected route
  if (!isAuthenticated && isProtectedRoute) {
    // Prevent redirect loop - if already on login page, don't redirect again
    if (pathname === '/login' || pathname === '/forgot-password' || pathname === '/reset-password' || pathname === '/verify-email' || pathname === '/verify-code') {
      return NextResponse.next();
    }

    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If user is authenticated and trying to access auth routes
  if (isAuthenticated && isAuthRoute) {
    const redirectPath = request.nextUrl.searchParams.get('redirect') || '/';
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // Add security headers
  const response = NextResponse.next();

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // CSRF protection for state-changing requests
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');

    if (origin && !origin.includes(host || '')) {
      return new NextResponse('Forbidden', { status: 403 });
    }
  }

  return response;
}

/**
 * Middleware configuration
 * Specify which routes should be processed by the middleware
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, icons, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
