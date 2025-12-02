import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const path = request.nextUrl.pathname;

  // Protected admin routes
  const adminRoutes = ['/admin', '/admin/dashboard', '/admin/posts', '/admin/settings'];

  // Check if route is admin route
  const isAdminRoute = adminRoutes.some(route => path.startsWith(route));

  if (isAdminRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Verify token and check admin status
      const response = await fetch(`${request.nextUrl.origin}/api/auth/verify`, {
        headers: {
          'Cookie': `auth-token=${token}`
        }
      });

      if (!response.ok) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      const user = await response.json();
      
      if (!user.isAdmin) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};