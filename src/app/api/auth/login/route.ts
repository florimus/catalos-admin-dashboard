import { fetchUserInfo } from '@/actions/user';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const accessToken = searchParams.get('accessToken');
  const refreshToken = searchParams.get('refreshToken');

  if (!accessToken || !refreshToken) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const cookieStore = cookies();
  (await cookieStore).set('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });
  (await cookieStore).set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });

  await fetchUserInfo()

  return NextResponse.redirect(new URL('/', req.url));
}
