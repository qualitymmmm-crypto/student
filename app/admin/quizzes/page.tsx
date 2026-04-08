'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { mockCourses, mockVideos, mockQuizzes } from '@/lib/mock-data'
import type { Quiz, Question } from '@/lib/types'
import { Plus, Pencil, Trash2, Clock, FileQuestion } from 'lucide-react'

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>(mockQuizzes)
  const [isOpen, setIsOpen] = useState(false)
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    courseId: '',
    videoId: '',
    type: 'video' as 'video' | 'monthly' | 'final',
    duration: ''
  })
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState({
    text: '',
    options: ['', '', '', ''],
    correctAnswer: 0
  })

  const handleOpen = (quiz?: Quiz) => {
    if (quiz) {
      setEditingQuiz(quiz)
      setFormData({
        title: quiz.title,
        courseId: quiz.courseId,
        videoId: quiz.videoId || '',
        type: quiz.type,
        duration: quiz.duration.toString()
      })
      setQuestions(quiz.questions)
    } else {
      setEditingQuiz(null)
      setFormData({ title: '', courseId: '', videoId: '', type: 'video', duration: '' })
      setQuestions([])
    }
    setIsOpen(true)
  }

  const addQuestion = () => {
    if (!currentQuestion.text || currentQuestion.options.some(o => !o)) {
      alert('يرجى ملء جميع الحقول')
      return
    }

    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      text: currentQuestion.text,
      options: currentQuestion.options,
      correctAnswer: currentQuestion.correctAnswer
    }
    setQuestions([...questions, newQuestion])
    setCurrentQuestion({ text: '', options: ['', '', '', ''], correctAnswer: 0 })
  }

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (questions.length === 0) {
      alert('يجب إضافة سؤال واحد على الأقل')
      return
    }

    if (editingQuiz) {
      setQuizzes(quizzes.map(q => 
        q.id === editingQuiz.id 
          ? { ...q, ...formData, duration: Number(formData.duration), questions }
          : q
      ))
    } else {
      const newQuiz: Quiz = {
        id: `quiz-${Date.now()}`,
        courseId: formData.courseId,
        videoId: formData.videoId || undefined,
        title: formData.title,
        type: formData.type,
        duration: Number(formData.duration),
        questions,
        createdAt: new Date().toISOString()
      }
      setQuizzes([...quizzes, newQuiz])
    }
    
    setIsOpen(false)
  }

  const handleDelete = (quizId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الاختبار؟')) {
      setQuizzes(quizzes.filter(q => q.id !== quizId))
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'video': return 'اختبار فيديو'
      case 'monthly': return 'اختبار شهري'
      case 'final': return 'اختبار نهائي'
      default: return type
    }
  }

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'video': return 'secondary'
      case 'monthly': return 'default'
      case 'final': return 'destructive'
      default: return 'secondary'
    }
  }

  const courseVideos = mockVideos.filter(v => v.courseId === formData.courseId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">الاختبارات</h1>
          <p className="text-muted-foreground">إدارة الاختبارات والأسئلة</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpen()}>
              <Plus className="ml-2 h-4 w-4" />
              إضافة اختبار
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingQuiz ? 'تعديل الاختبار' : 'إضافة اختبار جديد'}</DialogTitle>
              <DialogDescription>
                {editingQuiz ? 'قم بتعديل بيانات الاختبار' : 'أدخل بيانات الاختبار الجديد'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="courseId">الكورس</Label>
                    <Select value={formData.courseId} onValueChange={(v) => setFormData({ ...formData, courseId: v, videoId: '' })}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الكورس" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockCourses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">نوع الاختبار</Label>
                    <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as 'video' | 'monthly' | 'final' })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">اختبار فيديو</SelectItem>
                        <SelectItem value="monthly">اختبار شهري</SelectItem>
                        <SelectItem value="final">اختبار نهائي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {formData.type === 'video' && courseVideos.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="videoId">الفيديو المرتبط</Label>
                    <Select value={formData.videoId} onValueChange={(v) => setFormData({ ...formData, videoId: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الفيديو" />
                      </SelectTrigger>
                      <SelectContent>
                        {courseVideos.map((video) => (
                          <SelectItem key={video.id} value={video.id}>
                            {video.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">عنوان الاختبار</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="مثال: اختبار الجبر الأساسي"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">المدة (بالدقائق)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="15"
                      required
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* Questions Section */}
                <div className="border-t pt-4 mt-4">
                  <h3 className="font-semibold mb-4">الأسئلة ({questions.length})</h3>
                  
                  {/* Added Questions */}
                  {questions.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {questions.map((q, i) => (
                        <div key={q.id} className="flex items-center justify-between rounded-lg border p-3">
                          <div>
                            <span className="font-medium">س{i + 1}: </span>
                            <span className="text-muted-foreground">{q.text}</span>
                          </div>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeQuestion(i)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Question Form */}
                  <div className="space-y-4 rounded-lg border p-4">
                    <div className="space-y-2">
                      <Label>نص السؤال</Label>
                      <Input
                        value={currentQuestion.text}
                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
                        placeholder="أدخل نص السؤال"
                      />
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {currentQuestion.options.map((option, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="correctAnswer"
                            checked={currentQuestion.correctAnswer === i}
                            onChange={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: i })}
                          />
                          <Input
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...currentQuestion.options]
                              newOptions[i] = e.target.value
                              setCurrentQuestion({ ...currentQuestion, options: newOptions })
                            }}
                            placeholder={`الاختيار ${i + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                    <Button type="button" variant="outline" onClick={addQuestion}>
                      <Plus className="ml-2 h-4 w-4" />
                      إضافة السؤال
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  إلغاء
                </Button>
                <Button type="submit">
                  {editingQuiz ? 'حفظ التغييرات' : 'إضافة الاختبار'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz) => {
          const course = mockCourses.find(c => c.id === quiz.courseId)
          const video = quiz.videoId ? mockVideos.find(v => v.id === quiz.videoId) : null

          return (
            <Card key={quiz.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{quiz.title}</CardTitle>
                    <CardDescription className="mt-1">{course?.title}</CardDescription>
                  </div>
                  <Badge variant={getTypeBadgeVariant(quiz.type) as "default" | "secondary" | "destructive"}>
                    {getTypeLabel(quiz.type)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {video && (
                  <p className="text-sm text-muted-foreground mb-2">
                    مرتبط بـ: {video.title}
                  </p>
                )}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <FileQuestion className="h-4 w-4" />
                      {quiz.questions.length} سؤال
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {quiz.duration} دقيقة
                    </span>
                  </div>
                </div>
                <div className="flex gap-1 mt-4">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleOpen(quiz)}>
                    <Pencil className="ml-2 h-4 w-4" />
                    تعديل
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(quiz.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {quizzes.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">لا توجد اختبارات. أضف اختبار جديد للبدء.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
