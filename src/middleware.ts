// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('accessToken')?.value;
    const { pathname } = request.nextUrl;

    if (token || pathname.startsWith('/signin') || pathname.startsWith('/signup')) {
        return NextResponse.next();
    }

    return NextResponse.redirect(new URL('/signin', request.url));
}

export const config = {
  matcher: ['/'],
};
