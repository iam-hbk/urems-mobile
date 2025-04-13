import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { UREM__ERP_API_BASE } from '@/lib/wretch'

export async function GET() {
  try {
    const response = await fetch(
      `${UREM__ERP_API_BASE}/api/Employee/EmployeeWithDetails/2`
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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 