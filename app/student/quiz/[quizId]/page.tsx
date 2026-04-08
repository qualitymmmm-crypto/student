'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { mockQuizzes, mockCourses, mockStudentProgress } from '@/lib/mock-data'
import { Clock, CheckCircle, XCircle, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type QuizState = 'intro' | 'taking' | 'result'

export default function QuizPage({ params }: { params: Promise<{ quizId: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { user } = useAuth()
  
  const [state, setState] = useState<QuizState>('intro')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [score, setScore] = useState(0)

  const quiz = mockQuizzes.find(q => q.id === resolvedParams.quizId)
  const course = quiz ? mockCourses.find(c => c.id === quiz.courseId) : null

  useEffect(() => {
    if (quiz) {
      setAnswers(new Array(quiz.questions.length).fill(null))
      setTimeLeft(quiz.duration * 60)
    }
  }, [quiz])

  // Timer
  useEffect(() => {
    if (state !== 'taking' || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answerIndex
    setAnswers(newAnswers)
  }

  const handleSubmit = () => {
    if (!quiz) return

    let correctCount = 0
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) {
        correctCount++
      }
    })

    const finalScore = Math.round((correctCount / quiz.questions.length) * 100)
    setScore(finalScore)

    // Save result
    const progressIndex = mockStudentProgress.findIndex(
      p => p.studentId === user?.id && p.courseId === quiz.courseId
    )
    if (progressIndex !== -1) {
      mockStudentProgress[progressIndex].quizScores.push({
        quizId: quiz.id,
        score: finalScore,
        completedAt: new Date().toISOString()
      })
    }

    setState('result')
  }

  if (!quiz || !course) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Card className="w-full max-w-md">
          <CardContent className="py-12 text-center">
            <h2 className="text-xl font-bold mb-2">الاختبار غير موجود</h2>
            <p className="text-muted-foreground mb-4">لم يتم العثور على هذا الاختبار</p>
            <Button asChild>
              <Link href="/student/courses">العودة للكورسات</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Introduction Screen
  if (state === 'intro') {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{quiz.title}</CardTitle>
            <CardDescription>{course.title}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3 text-center">
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-2xl font-bold text-primary">{quiz.questions.length}</p>
                <p className="text-sm text-muted-foreground">سؤال</p>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-2xl font-bold text-primary">{quiz.duration}</p>
                <p className="text-sm text-muted-foreground">دقيقة</p>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-2xl font-bold text-primary">60%</p>
                <p className="text-sm text-muted-foreground">الحد الأدنى للنجاح</p>
              </div>
            </div>

            <div className="space-y-3 text-muted-foreground">
              <h3 className="font-semibold text-foreground">تعليمات الاختبار:</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>اقرأ كل سؤال بعناية قبل الإجابة</li>
                <li>يمكنك التنقل بين الأسئلة وتغيير إجاباتك</li>
                <li>سيتم إرسال الاختبار تلقائياً عند انتهاء الوقت</li>
                <li>لا يمكنك العودة للاختبار بعد إرساله</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" asChild>
                <Link href={`/student/courses/${course.id}`}>
                  <ChevronRight className="ml-2 h-4 w-4" />
                  رجوع
                </Link>
              </Button>
              <Button className="flex-1" onClick={() => setState('taking')}>
                ابدأ الاختبار
                <ChevronLeft className="mr-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Result Screen
  if (state === 'result') {
    const passed = score >= 60
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="py-12 text-center space-y-6">
            <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center ${
              passed ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400'
            }`}>
              {passed ? (
                <CheckCircle className="h-12 w-12" />
              ) : (
                <XCircle className="h-12 w-12" />
              )}
            </div>

            <div>
              <h2 className="text-3xl font-bold">{score}%</h2>
              <p className={`text-lg font-medium ${passed ? 'text-green-600' : 'text-red-600'}`}>
                {passed ? 'أحسنت! اجتزت الاختبار' : 'للأسف، لم تجتز الاختبار'}
              </p>
            </div>

            <div className="flex justify-center gap-8 text-sm">
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {quiz.questions.filter((q, i) => answers[i] === q.correctAnswer).length}
                </p>
                <p className="text-muted-foreground">إجابات صحيحة</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">
                  {quiz.questions.filter((q, i) => answers[i] !== q.correctAnswer).length}
                </p>
                <p className="text-muted-foreground">إجابات خاطئة</p>
              </div>
            </div>

            {/* Review Answers */}
            <div className="text-right space-y-4 border-t pt-6">
              <h3 className="font-semibold">مراجعة الإجابات:</h3>
              {quiz.questions.map((q, i) => {
                const isCorrect = answers[i] === q.correctAnswer
                return (
                  <div key={q.id} className={`p-4 rounded-lg border ${
                    isCorrect ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950' : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'
                  }`}>
                    <p className="font-medium mb-2">
                      {i + 1}. {q.text}
                    </p>
                    <p className={`text-sm ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                      إجابتك: {answers[i] !== null ? q.options[answers[i]] : 'لم تجب'}
                    </p>
                    {!isCorrect && (
                      <p className="text-sm text-green-600">
                        الإجابة الصحيحة: {q.options[q.correctAnswer]}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>

            <Button asChild>
              <Link href={`/student/courses/${course.id}`}>
                العودة للكورس
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Quiz Taking Screen
  const question = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100
  const answeredCount = answers.filter(a => a !== null).length

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold">{quiz.title}</h1>
          <p className="text-sm text-muted-foreground">السؤال {currentQuestion + 1} من {quiz.questions.length}</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          timeLeft < 60 ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400' : 'bg-muted'
        }`}>
          <Clock className="h-4 w-4" />
          <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
        </div>
      </div>

      <Progress value={progress} className="h-2" />

      {/* Question Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg leading-relaxed">
            {currentQuestion + 1}. {question.text}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className={cn(
                "w-full text-right p-4 rounded-lg border-2 transition-colors",
                answers[currentQuestion] === index
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              <span className="font-medium">{String.fromCharCode(65 + index)}.</span>{' '}
              {option}
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestion(prev => prev - 1)}
          disabled={currentQuestion === 0}
        >
          <ChevronRight className="ml-2 h-4 w-4" />
          السابق
        </Button>

        <div className="flex gap-1">
          {quiz.questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentQuestion(i)}
              className={cn(
                "w-8 h-8 rounded text-sm font-medium transition-colors",
                i === currentQuestion
                  ? "bg-primary text-primary-foreground"
                  : answers[i] !== null
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  : "bg-muted"
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {currentQuestion < quiz.questions.length - 1 ? (
          <Button onClick={() => setCurrentQuestion(prev => prev + 1)}>
            التالي
            <ChevronLeft className="mr-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit}>
            إرسال الاختبار
          </Button>
        )}
      </div>

      {/* Warning if not all answered */}
      {answeredCount < quiz.questions.length && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-50 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm">
            لم تجب على {quiz.questions.length - answeredCount} سؤال
          </span>
        </div>
      )}
    </div>
  )
}
