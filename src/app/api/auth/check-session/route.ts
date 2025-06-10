import { TypeSession } from '@/lib/auth/config';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Get the session cookie
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) {
      return NextResponse.json(null);
    }

    // Parse the cookie string to find auth_session
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {} as { [key: string]: string });

    const sessionCookie = cookies['auth_session'];
    if (!sessionCookie) {
      return NextResponse.json(null);
    }

    // Parse and validate the session
    try {
      const session = JSON.parse(decodeURIComponent(sessionCookie)) as TypeSession;

      // Check if session is expired
      if (new Date(session.expires) < new Date()) {
        return NextResponse.json(null);
      }

      return NextResponse.json(session);
    } catch {
      return NextResponse.json(null);
    }
  } catch (error) {
    console.error('Error checking session:', error);
    return NextResponse.json(null);
  }
} 