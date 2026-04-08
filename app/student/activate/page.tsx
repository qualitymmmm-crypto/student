'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { mockAccessCodes, mockCourses } from '@/lib/mock-data'
import { Key, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function ActivatePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; courseName?: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const accessCode = mockAccessCodes.find(c => c.code === code.toUpperCase())

    if (!accessCode) {
      setResult({ success: false, message: 'الكود غير صحيح. تأكد من كتابة الكود بشكل صحيح.' })
      setIsLoading(false)
      return
    }

    if (accessCode.isUsed) {
      setResult({ success: false, message: 'هذا الكود مستخدم مسبقاً.' })
      setIsLoading(false)
      return
    }

    // Activate the code
    const codeIndex = mockAccessCodes.findIndex(c => c.code === code.toUpperCase())
    if (codeIndex !== -1) {
      mockAccessCodes[codeIndex] = {
        ...mockAccessCodes[codeIndex],
        isUsed: true,
        studentId: user?.id,
        usedAt: new Date().toISOString()
      }
    }

    const course = mockCourses.find(c => c.id === accessCode.courseId)
    setResult({ 
      success: true, 
      message: 'تم تفعيل الكود بنجاح!',
      courseName: course?.title
    })
    setIsLoading(false)
    setCode('')
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">تفعيل كود</h1>
        <p className="text-muted-foreground">أدخل كود التفعيل للوصول إلى الكورس</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            إدخال كود التفعيل
          </CardTitle>
          <CardDescription>
            احصل على كود التفعيل من المدرس بعد الدفع
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">كود التفعيل</Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="مثال: ABC123"
                className="text-center text-2xl tracking-widest font-mono"
                maxLength={6}
                dir="ltr"
                required
              />
            </div>

            {result && (
              <div className={`flex items-start gap-3 p-4 rounded-lg ${
                result.success 
                  ? 'bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200' 
                  : 'bg-destructive/10 text-destructive'
              }`}>
                {result.success ? (
                  <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-medium">{result.message}</p>
                  {result.courseName && (
                    <p className="text-sm mt-1">الكورس: {result.courseName}</p>
                  )}
                </div>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading || code.length < 6}>
              {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              تفعيل الكود
            </Button>

            {result?.success && (
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={() => router.push('/student/courses')}
              >
                الذهاب إلى الكورسات
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>كيفية الحصول على كود؟</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>1. تواصل مع المدرس عبر الواتساب أو التليجرام</p>
          <p>2. ادفع قيمة الكورس المطلوب</p>
          <p>3. ستحصل على كود تفعيل مكون من 6 أحرف</p>
          <p>4. أدخل الكود هنا لتفعيل الكورس</p>
        </CardContent>
      </Card>

      {/* Demo Codes */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-sm">أكواد تجريبية (للاختبار)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            {mockAccessCodes.filter(c => !c.isUsed).slice(0, 3).map(c => {
              const course = mockCourses.find(course => course.id === c.courseId)
              return (
                <div key={c.id} className="flex items-center justify-between p-2 rounded bg-muted">
                  <span className="font-mono font-bold">{c.code}</span>
                  <span className="text-muted-foreground text-xs">{course?.title}</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
