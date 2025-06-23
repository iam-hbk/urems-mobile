import { redirect } from 'next/navigation'
import { verifySession } from '@/lib/auth/dal'
import { ReactNode } from 'react'

interface ProtectedPageProps {
  children: ReactNode
  fallbackUrl?: string
}

export default async function ProtectedPage({ 
  children, 
  fallbackUrl = '/login' 
}: ProtectedPageProps) {
  const session = await verifySession()
  
  if (!session) {
    redirect(fallbackUrl)
  }
  
  return <>{children}</>
}

// Role-based access control component
interface RoleProtectedPageProps extends ProtectedPageProps {
  allowedRoles?: string[]
  userRole?: string
}

export async function RoleProtectedPage({ 
  children, 
  allowedRoles = [], 
  fallbackUrl = '/unauthorized' 
}: RoleProtectedPageProps) {
  const session = await verifySession()
  
  if (!session) {
    redirect('/login')
  }
  
  // If roles are specified and user doesn't have required role
  if (allowedRoles.length > 0) {
    const userRole = (session.user as any)?.role // Adjust based on your user object structure
    if (!userRole || !allowedRoles.includes(userRole)) {
      redirect(fallbackUrl)
    }
  }
  
  return <>{children}</>
} 