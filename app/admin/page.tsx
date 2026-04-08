'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { mockCourses, mockVideos, mockQuizzes, mockUsers, mockAccessCodes } from '@/lib/mock-data'
import { BookOpen, Video, FileQuestion, Users, Key, TrendingUp } from 'lucide-react'

export default function AdminDashboard() {
  const students = mockUsers.filter(u => u.role === 'student')
  const usedCodes = mockAccessCodes.filter(c => c.isUsed)

  const stats = [
    { label: 'الكورسات', value: mockCourses.length, icon: BookOpen, color: 'text-blue-600' },
    { label: 'الفيديوهات', value: mockVideos.length, icon: Video, color: 'text-green-600' },
    { label: 'الاختبارات', value: mockQuizzes.length, icon: FileQuestion, color: 'text-orange-600' },
    { label: 'الطلاب', value: students.length, icon: Users, color: 'text-purple-600' },
    { label: 'أكواد مستخدمة', value: usedCodes.length, icon: Key, color: 'text-pink-600' },
    { label: 'نسبة التفعيل', value: `${Math.round((usedCodes.length / mockAccessCodes.length) * 100)}%`, icon: TrendingUp, color: 'text-teal-600' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">لوحة التحكم</h1>
        <p className="text-muted-foreground">مرحباً بك في لوحة تحكم منصة المهندس</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>آخر الطلاب المسجلين</CardTitle>
            <CardDescription>أحدث الطلاب الذين انضموا للمنصة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {students.slice(0, 5).map((student) => (
                <div key={student.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">{student.email}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{student.governorate}</span>
                </div>
              ))}
              {students.length === 0 && (
                <p className="text-muted-foreground text-center py-4">لا يوجد طلاب مسجلين</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>آخر أكواد التفعيل المستخدمة</CardTitle>
            <CardDescription>أحدث الأكواد التي تم استخدامها</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {usedCodes.slice(0, 5).map((code) => {
                const course = mockCourses.find(c => c.id === code.courseId)
                const student = mockUsers.find(u => u.id === code.studentId)
                return (
                  <div key={code.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium font-mono">{code.code}</p>
                      <p className="text-sm text-muted-foreground">{course?.title}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{student?.name}</span>
                  </div>
                )
              })}
              {usedCodes.length === 0 && (
                <p className="text-muted-foreground text-center py-4">لا توجد أكواد مستخدمة</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
