import { NextResponse } from 'next/server'
import { API_BASE_URL } from '@/lib/wretch'

export async function GET() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/Employee/EmployeeWithDetails/2`
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch employee data' },
        { status: response.status }
      )
    }

    const employeeData = await response.json()
    const response_ = NextResponse.json(employeeData)

    // Set the employee data in a cookie
    response_.cookies.set('employee_data', JSON.stringify(employeeData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 hours
    })

    return response_
  } catch (error) {
    if (error) { }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 