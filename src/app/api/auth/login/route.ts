import { NextResponse } from 'next/server'
import { API_BASE_URL } from '@/lib/wretch'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Call the backend login endpoint
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: errorData },
        { status: response.status }
      )
    }

    const loginData = await response.json()
    
    // Create the response
    const response_ = NextResponse.json(loginData)
    
    // Set the user ID as a cookie (this is what the frontend needs)
    response_.cookies.set('sidbf-sodfb-tfugyihu-cvug-tyvubin-yfvgubhivgb', loginData.userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 hours
    })
    
    // The backend should be setting the access token as an http-only cookie
    // We need to forward any cookies from the backend response
    const setCookieHeaders = response.headers.getSetCookie()
    if (setCookieHeaders && setCookieHeaders.length > 0) {
      // Forward all Set-Cookie headers from the backend
      setCookieHeaders.forEach(cookieHeader => {
        response_.headers.append('set-cookie', cookieHeader)
      })
    }

    return response_
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 