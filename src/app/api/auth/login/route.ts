import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { Session } from '@/lib/auth/config';
import { EmployeeData } from '@/app/profile/page';

// Mock user for testing
const MOCK_USER: EmployeeData = {
  employeeNumber: 2,
  employeeType: {
    employeeTypeId: 1,
    typeDescription: "Emergency Medical Technician"
  },
  person: {
    personId: 1,
    firstName: "John",
    secondName: "",
    lastName: "Doe",
    dateOfBirth: new Date('1990-01-01').toISOString(),
    initials: "JD",
    gender: "Male",
    personContactDetails: [{
      isPrimary: true,
      contactDetails: {
        cellNumber: "1234567890",
        email: "john@example.com",
        telephoneNumber: "",
        contactDetailsType: 1,
        contactDetailsTypeNavigation: {
          typeDescription: "Primary"
        }
      }
    }],
    personIdentifications: []
  },
  assignedVehicle: null
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // In a real app, you would validate credentials here
    // For now, just check if employeeNumber matches our mock user
    if (body.employeeNumber !== MOCK_USER.employeeNumber.toString()) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create session
    const session: Session = {
      user: MOCK_USER,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    };

    const response = NextResponse.json(session);

    // Set session cookie
    response.cookies.set('auth_session', JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(session.expires),
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 