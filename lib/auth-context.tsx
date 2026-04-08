'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { User } from './types'

interface AuthContextType {
  user: (User & { password?: never }) | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (userData: Omit<User, 'id' | 'role' | 'createdAt'> & { password: string }) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<(User & { password?: never }) | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('theengineer_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        setUser(data.user)
        localStorage.setItem('theengineer_user', JSON.stringify(data.user))
        return { success: true }
      }

      return { success: false, error: data.error }
    } catch (error) {
      return { success: false, error: 'حدث خطأ في الاتصال' }
    }
  }

  const register = async (userData: Omit<User, 'id' | 'role' | 'createdAt'> & { password: string }): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (data.success) {
        setUser(data.user)
        localStorage.setItem('theengineer_user', JSON.stringify(data.user))
        return { success: true }
      }

      return { success: false, error: data.error }
    } catch (error) {
      return { success: false, error: 'حدث خطأ في الاتصال' }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('theengineer_user')
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
