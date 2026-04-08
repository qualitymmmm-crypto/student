'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  BookOpen, 
  Video, 
  FileQuestion, 
  Users, 
  Key, 
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/theme-toggle'

const navItems = [
  { href: '/admin', label: 'لوحة التحكم', icon: LayoutDashboard },
  { href: '/admin/courses', label: 'الكورسات', icon: BookOpen },
  { href: '/admin/videos', label: 'الفيديوهات', icon: Video },
  { href: '/admin/quizzes', label: 'الاختبارات', icon: FileQuestion },
  { href: '/admin/students', label: 'الطلاب', icon: Users },
  { href: '/admin/codes', label: 'أكواد التفعيل', icon: Key },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoading, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 border-b bg-background">
        <div className="flex h-16 items-center justify-between px-4">
          <button onClick={() => setSidebarOpen(true)} className="p-2">
            <Menu className="h-6 w-6" />
          </button>
          <span className="font-bold">لوحة التحكم</span>
          <ThemeToggle />
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 right-0 z-50 w-64 bg-card border-l transform transition-transform duration-200 lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
      )}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b px-4">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                م
              </div>
              <span className="font-bold">المهندس</span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                        isActive 
                          ? "bg-primary text-primary-foreground" 
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* User Section */}
          <div className="border-t p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm">
                <p className="font-medium">{user.name}</p>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
              <div className="hidden lg:block">
                <ThemeToggle />
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={handleLogout}>
              <LogOut className="ml-2 h-4 w-4" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pr-64">
        <div className="container py-6">
          {children}
        </div>
      </main>
    </div>
  )
}
