'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { mockCourses, mockVideos, mockAccessCodes, mockStudentProgress } from '@/lib/mock-data'
import { BookOpen, Video, Play, Key } from 'lucide-react'

export default function StudentCoursesPage() {
  const { user } = useAuth()

  const enrolledCodes = mockAccessCodes.filter(c => c.studentId === user?.id && c.isUsed)
  const enrolledCourseIds = enrolledCodes.map(c => c.courseId)
  const enrolledCourses = mockCourses.filter(c => enrolledCourseIds.includes(c.id))

  const progress = mockStudentProgress.find(p => p.studentId === user?.id)

  const getProgress = (courseId: string) => {
    const courseVideos = mockVideos.filter(v => v.courseId === courseId)
    if (!progress || courseVideos.length === 0) return 0
    const completed = progress.completedVideos.filter(v => 
      courseVideos.some(cv => cv.id === v)
    ).length
    return Math.round((completed / courseVideos.length) * 100)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">كورساتي</h1>
          <p className="text-muted-foreground">جميع الكورسات المفعلة</p>
        </div>
        <Button asChild>
          <Link href="/student/activate">
            <Key className="ml-2 h-4 w-4" />
            تفعيل كود جديد
          </Link>
        </Button>
      </div>

      {enrolledCourses.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {enrolledCourses.map((course) => {
            const courseProgress = getProgress(course.id)
            const courseVideos = mockVideos.filter(v => v.courseId === course.id)
            const completedCount = progress?.completedVideos.filter(v => 
              courseVideos.some(cv => cv.id === v)
            ).length || 0

            return (
              <Card key={course.id} className="overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative">
                  <BookOpen className="h-16 w-16 text-primary/50" />
                </div>
                <CardContent className="p-6">
                  <CardTitle className="text-xl mb-2">{course.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">التقدم</span>
                      <span className="font-medium">{courseProgress}%</span>
                    </div>
                    <Progress value={courseProgress} className="h-2" />
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Video className="h-4 w-4" />
                        {completedCount}/{courseVideos.length} فيديو
                      </span>
                    </div>
                  </div>

                  <Button className="w-full" asChild>
                    <Link href={`/student/courses/${course.id}`}>
                      <Play className="ml-2 h-4 w-4" />
                      {courseProgress > 0 ? 'متابعة' : 'ابدأ الآن'}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16 text-center">
            <Key className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">لا توجد كورسات مفعلة</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              للوصول إلى الكورسات، قم بشراء كود تفعيل من المدرس ثم أدخله هنا
            </p>
            <Button size="lg" asChild>
              <Link href="/student/activate">
                <Key className="ml-2 h-5 w-5" />
                تفعيل كود
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
