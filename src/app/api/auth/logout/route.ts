import { UserTokenCookieName } from '@/lib/auth/config';
import { deleteCookie } from '@/utils/cookies';
import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });


  await deleteCookie(UserTokenCookieName);

  // Clear the session cookie
  response.cookies.set('auth_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(0),
  });

  return response;
} 