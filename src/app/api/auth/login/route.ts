import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const employeeData = await request.json();

    // Create a new response
    const response = NextResponse.json({ success: true });

    // Set the cookie on the response
    response.cookies.set('employee_session', JSON.stringify(employeeData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process login' },
      { status: 500 }
    );
  }
} 