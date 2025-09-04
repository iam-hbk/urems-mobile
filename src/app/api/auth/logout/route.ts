import { NextResponse } from 'next/server'
import { API_BASE_URL } from '@/lib/wretch'
import { cookieNameUserId } from '@/utils/constant'

export async function POST() {
  try {
    // Call the backend logout endpoint
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Create the response
    const response_ = NextResponse.json({ message: 'Logged out successfully' })
    
    // Clear the user ID cookie
    response_.cookies.delete(cookieNameUserId)
    
    // Forward any cookie clearing from the backend
    const setCookieHeader = response.headers.get('set-cookie')
    if (setCookieHeader) {
      response_.headers.set('set-cookie', setCookieHeader)
    }

    return response_
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 