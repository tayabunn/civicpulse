import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface SessionPayload {
  id?: string;
  email?: string;
  role?: string;
  name?: string;
  departmentId?: string | null;
  exp?: number;
}

function decodeJwtPayload(token: string, fallbackRole?: string): SessionPayload | null {
  if (!token) {
    if (fallbackRole) return { role: fallbackRole };
    return null;
  }

  // Support demo persona tokens
  if (token.startsWith('demo-token-')) {
    const persona = token.replace('demo-token-', '');
    if (persona === 'admin') return { role: 'admin', email: 'admin@civicpulse.gov' };
    if (persona === 'manager') return { role: 'department_manager', email: 'manager@civicpulse.gov' };
    if (persona === 'staff') return { role: 'maintenance_staff', email: 'staff@civicpulse.gov' };
    return { role: 'citizen', email: 'citizen@civicpulse.gov' };
  }

  // Support local token fallback
  if (token.startsWith('jwt-')) {
    return { role: fallbackRole || 'citizen' };
  }

  try {
    const parts = token.split('.');
    if (parts.length === 3) {
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const parsed = JSON.parse(jsonPayload);
      // Check expiration if present
      if (parsed.exp && parsed.exp * 1000 < Date.now()) {
        return null;
      }
      return parsed;
    }
  } catch {}

  if (fallbackRole) {
    return { role: fallbackRole };
  }
  return null;
}

function getDashboardForRole(role?: string): string {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'manager':
    case 'department_manager':
      return '/manager';
    case 'staff':
    case 'maintenance_staff':
      return '/staff';
    case 'citizen':
    default:
      return '/citizen';
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve session token from cookie
  const sessionCookie = request.cookies.get('civicpulse_session')?.value;
  const roleCookie = request.cookies.get('civicpulse_role')?.value;
  const user = decodeJwtPayload(sessionCookie || '', roleCookie);
  const isAuthenticated = Boolean(user);

  // Security Headers applied to every response
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(self)'
  );

  // 1. Authenticated User accessing Auth Pages (/login, /register) -> Auto-redirect to Dashboard
  if ((pathname === '/login' || pathname === '/register') && isAuthenticated) {
    const dashboardUrl = new URL(getDashboardForRole(user?.role), request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // 2. Dashboard Route Guards (Server-Side RBAC Enforcement)
  const isDashboardRoute =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/manager') ||
    pathname.startsWith('/staff') ||
    pathname.startsWith('/citizen') ||
    pathname.startsWith('/profile');

  if (isDashboardRoute) {
    // If not authenticated, redirect to /login immediately before any page code loads
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const role = user?.role || 'citizen';

    // Strict Role Boundary Checks:
    // Only 'admin' can access /admin routes
    if (pathname.startsWith('/admin') && role !== 'admin') {
      const fallbackUrl = new URL('/citizen', request.url);
      fallbackUrl.searchParams.set('denied', 'admin_access_restricted');
      return NextResponse.redirect(fallbackUrl);
    }

    // Only 'manager' or 'admin' can access /manager routes
    if (
      pathname.startsWith('/manager') &&
      role !== 'manager' &&
      role !== 'department_manager' &&
      role !== 'admin'
    ) {
      const fallbackUrl = new URL('/citizen', request.url);
      fallbackUrl.searchParams.set('denied', 'manager_access_restricted');
      return NextResponse.redirect(fallbackUrl);
    }

    // Only 'staff' or 'admin' can access /staff routes
    if (
      pathname.startsWith('/staff') &&
      role !== 'staff' &&
      role !== 'maintenance_staff' &&
      role !== 'admin'
    ) {
      const fallbackUrl = new URL('/citizen', request.url);
      fallbackUrl.searchParams.set('denied', 'staff_access_restricted');
      return NextResponse.redirect(fallbackUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/manager/:path*',
    '/staff/:path*',
    '/citizen/:path*',
    '/profile/:path*',
    '/login',
    '/register',
  ],
};
