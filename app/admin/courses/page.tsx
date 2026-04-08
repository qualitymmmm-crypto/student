'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { mockCourses, mockVideos, mockQuizzes, grades } from '@/lib/mock-data'
import type { Course } from '@/lib/types'
import { Plus, Pencil, Trash2, Video, FileQuestion } from 'lucide-react'

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>(mockCourses)
  const [isOpen, setIsOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    grade: '',
    price: ''
  })

  const handleOpen = (course?: Course) => {
    if (course) {
      setEditingCourse(course)
      setFormData({
        title: course.title,
        description: course.description,
        grade: course.grade,
        price: course.price.toString()
      })
    } else {
      setEditingCourse(null)
      setFormData({ title: '', description: '', grade: '', price: '' })
    }
    setIsOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingCourse) {
      setCourses(courses.map(c => 
        c.id === editingCourse.id 
          ? { ...c, ...formData, price: Number(formData.price) }
          : c
      ))
    } else {
      const newCourse: Course = {
        id: `course-${Date.now()}`,
        title: formData.title,
        description: formData.description,
        grade: formData.grade,
        thumbnail: '/placeholder.svg?height=200&width=300',
        price: Number(formData.price),
        videosCount: 0,
        quizzesCount: 0,
        createdAt: new Date().toISOString()
      }
      setCourses([...courses, newCourse])
    }
    
    setIsOpen(false)
  }

  const handleDelete = (courseId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الكورس؟')) {
      setCourses(courses.filter(c => c.id !== courseId))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">الكورسات</h1>
          <p className="text-muted-foreground">إدارة الكورسات المتاحة على المنصة</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpen()}>
              <Plus className="ml-2 h-4 w-4" />
              إضافة كورس
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCourse ? 'تعديل الكورس' : 'إضافة كورس جديد'}</DialogTitle>
              <DialogDescription>
                {editingCourse ? 'قم بتعديل بيانات الكورس' : 'أدخل بيانات الكورس الجديد'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">عنوان الكورس</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="مثال: الرياضيات - الصف الأول الثانوي"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">وصف الكورس</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="وصف مختصر للكورس"
                    required
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="grade">الصف الدراسي</Label>
                    <Select value={formData.grade} onValueChange={(v) => setFormData({ ...formData, grade: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الصف" />
                      </SelectTrigger>
                      <SelectContent>
                        {grades.map((grade) => (
                          <SelectItem key={grade.value} value={grade.value}>
                            {grade.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">السعر (جنيه)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="500"
                      required
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  إلغاء
                </Button>
                <Button type="submit">
                  {editingCourse ? 'حفظ التغييرات' : 'إضافة الكورس'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => {
          const videosCount = mockVideos.filter(v => v.courseId === course.id).length
          const quizzesCount = mockQuizzes.filter(q => q.courseId === course.id).length
          const gradeLabel = grades.find(g => g.value === course.grade)?.label || course.grade

          return (
            <Card key={course.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription className="mt-1">{gradeLabel}</CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleOpen(course)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(course.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {course.description}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Video className="h-4 w-4" />
                      {videosCount}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <FileQuestion className="h-4 w-4" />
                      {quizzesCount}
                    </span>
                  </div>
                  <span className="font-bold text-primary">{course.price} ج.م</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {courses.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">لا توجد كورسات. أضف كورس جديد للبدء.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
