import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

const BYPASS = ['/admin', '/opengraph-image', '/twitter-image', '/sitemap.xml', '/robots.txt'];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (BYPASS.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
