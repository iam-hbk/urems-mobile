import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/auth/dal'

export async function GET() {
  const result = await verifySession()

  if (result.isErr()) {
    return NextResponse.json(
      { error: result.error }, 
      { status: result.error.status || 500 }
    )
  }

  return NextResponse.json(result.value)
} 