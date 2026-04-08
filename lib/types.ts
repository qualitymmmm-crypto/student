export interface User {
  id: string
  email: string
  name: string
  phone: string
  parentPhone: string
  governorate: string
  grade: string
  role: 'student' | 'admin'
  createdAt: string
}

export interface Course {
  id: string
  title: string
  description: string
  grade: string
  thumbnail: string
  price: number
  videosCount: number
  quizzesCount: number
  createdAt: string
}

export interface Video {
  id: string
  courseId: string
  title: string
  description: string
  url: string
  duration: string
  order: number
  createdAt: string
}

export interface Quiz {
  id: string
  courseId: string
  videoId?: string
  title: string
  type: 'video' | 'monthly' | 'final'
  questions: Question[]
  duration: number // in minutes
  createdAt: string
}

export interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: number
  imageUrl?: string
}

export interface AccessCode {
  id: string
  code: string
  courseId: string
  studentId?: string
  isUsed: boolean
  createdAt: string
  usedAt?: string
}

export interface StudentProgress {
  id: string
  studentId: string
  courseId: string
  completedVideos: string[]
  quizScores: { quizId: string; score: number; completedAt: string }[]
}

export interface QuizResult {
  quizId: string
  studentId: string
  score: number
  answers: number[]
  completedAt: string
}
