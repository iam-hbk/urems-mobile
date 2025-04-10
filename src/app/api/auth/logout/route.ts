import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Create a new response
    const response = NextResponse.json({ success: true });

    // Delete the session cookie
    response.cookies.delete('employee_session');

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process logout' },
      { status: 500 }
    );
  }
} 