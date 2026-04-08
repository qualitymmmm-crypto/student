'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { mockCourses, mockVideos, mockAccessCodes, mockStudentProgress, grades } from '@/lib/mock-data'
import { BookOpen, Video, FileQuestion, Key, Play, ChevronLeft } from 'lucide-react'

export default function StudentDashboard() {
  const { user } = useAuth()

  // Get student's enrolled courses
  const enrolledCodes = mockAccessCodes.filter(c => c.studentId === user?.id && c.isUsed)
  const enrolledCourseIds = enrolledCodes.map(c => c.courseId)
  const enrolledCourses = mockCourses.filter(c => enrolledCourseIds.includes(c.id))

  // Get recommended courses based on grade
  const recommendedCourses = mockCourses.filter(c => c.grade === user?.grade && !enrolledCourseIds.includes(c.id))

  // Get progress
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
      <div>
        <h1 className="text-3xl font-bold">مرحباً، {user?.name}</h1>
        <p className="text-muted-foreground">
          {grades.find(g => g.value === user?.grade)?.label || 'الصف الدراسي'}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">كورساتي</CardTitle>
            <BookOpen className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrolledCourses.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">فيديوهات مكتملة</CardTitle>
            <Video className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progress?.completedVideos.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">اختبارات مجتازة</CardTitle>
            <FileQuestion className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progress?.quizScores.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">متوسط الدرجات</CardTitle>
            <FileQuestion className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {progress?.quizScores.length 
                ? Math.round(progress.quizScores.reduce((a, b) => a + b.score, 0) / progress.quizScores.length)
                : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enrolled Courses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">كورساتي</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/student/courses">عرض الكل</Link>
          </Button>
        </div>

        {enrolledCourses.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {enrolledCourses.map((course) => {
              const courseProgress = getProgress(course.id)
              const courseVideos = mockVideos.filter(v => v.courseId === course.id)

              return (
                <Card key={course.id} className="overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative">
                    <BookOpen className="h-12 w-12 text-primary/50" />
                    {courseProgress > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 bg-background/90 p-2">
                        <Progress value={courseProgress} className="h-2" />
                        <p className="text-xs text-center mt-1">{courseProgress}% مكتمل</p>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <CardTitle className="text-lg mb-2">{course.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Video className="h-4 w-4" />
                        {courseVideos.length} فيديو
                      </span>
                    </div>
                    <Button className="w-full" asChild>
                      <Link href={`/student/courses/${course.id}`}>
                        <Play className="ml-2 h-4 w-4" />
                        متابعة المشاهدة
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Key className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-2">لا توجد كورسات مفعلة</h3>
              <p className="text-muted-foreground mb-4">قم بتفعيل كود للوصول إلى الكورسات</p>
              <Button asChild>
                <Link href="/student/activate">
                  <Key className="ml-2 h-4 w-4" />
                  تفعيل كود
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recommended Courses */}
      {recommendedCourses.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">كورسات مقترحة لك</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recommendedCourses.map((course) => (
              <Card key={course.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">{course.price} ج.م</span>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/student/activate">
                        تفعيل
                        <ChevronLeft className="mr-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
