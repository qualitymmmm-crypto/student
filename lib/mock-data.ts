import type { User, Course, Video, Quiz, AccessCode, StudentProgress } from './types'

export const mockUsers: User[] = [
  {
    id: 'admin-1',
    email: 'admin@theengineer.com',
    name: 'المهندس أحمد',
    phone: '01000000000',
    parentPhone: '',
    governorate: 'القاهرة',
    grade: '',
    role: 'admin',
    createdAt: '2024-01-01'
  },
  {
    id: 'student-1',
    email: 'student@test.com',
    name: 'محمد أحمد',
    phone: '01111111111',
    parentPhone: '01222222222',
    governorate: 'الإسكندرية',
    grade: 'first',
    role: 'student',
    createdAt: '2024-01-15'
  },
  {
    id: 'student-2',
    email: 'sara@test.com',
    name: 'سارة محمود',
    phone: '01333333333',
    parentPhone: '01444444444',
    governorate: 'الجيزة',
    grade: 'second',
    role: 'student',
    createdAt: '2024-02-01'
  }
]

export const mockCourses: Course[] = [
  {
    id: 'course-1',
    title: 'الرياضيات - الصف الأول الثانوي',
    description: 'شرح شامل لمنهج الرياضيات للصف الأول الثانوي يتضمن الجبر والهندسة وحساب المثلثات',
    grade: 'first',
    thumbnail: '/placeholder.svg?height=200&width=300',
    price: 500,
    videosCount: 24,
    quizzesCount: 8,
    createdAt: '2024-01-01'
  },
  {
    id: 'course-2',
    title: 'الرياضيات - الصف الثاني الثانوي',
    description: 'شرح شامل لمنهج الرياضيات للصف الثاني الثانوي يتضمن التفاضل والتكامل والجبر',
    grade: 'second',
    thumbnail: '/placeholder.svg?height=200&width=300',
    price: 600,
    videosCount: 30,
    quizzesCount: 10,
    createdAt: '2024-01-01'
  },
  {
    id: 'course-3',
    title: 'الرياضيات - الصف الثالث الثانوي',
    description: 'شرح شامل لمنهج الرياضيات للصف الثالث الثانوي - الثانوية العامة',
    grade: 'third',
    thumbnail: '/placeholder.svg?height=200&width=300',
    price: 800,
    videosCount: 40,
    quizzesCount: 15,
    createdAt: '2024-01-01'
  }
]

export const mockVideos: Video[] = [
  {
    id: 'video-1',
    courseId: 'course-1',
    title: 'مقدمة في الجبر',
    description: 'شرح أساسيات الجبر والمعادلات الخطية',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '45:00',
    order: 1,
    createdAt: '2024-01-01'
  },
  {
    id: 'video-2',
    courseId: 'course-1',
    title: 'المعادلات التربيعية',
    description: 'شرح حل المعادلات التربيعية بطرق مختلفة',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '50:00',
    order: 2,
    createdAt: '2024-01-02'
  },
  {
    id: 'video-3',
    courseId: 'course-1',
    title: 'الدوال وخصائصها',
    description: 'شرح مفهوم الدوال وأنواعها وخصائصها',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '55:00',
    order: 3,
    createdAt: '2024-01-03'
  },
  {
    id: 'video-4',
    courseId: 'course-2',
    title: 'مقدمة في التفاضل',
    description: 'شرح أساسيات التفاضل والنهايات',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '60:00',
    order: 1,
    createdAt: '2024-01-01'
  },
  {
    id: 'video-5',
    courseId: 'course-2',
    title: 'قواعد التفاضل',
    description: 'شرح قواعد التفاضل الأساسية',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '55:00',
    order: 2,
    createdAt: '2024-01-02'
  }
]

export const mockQuizzes: Quiz[] = [
  {
    id: 'quiz-1',
    courseId: 'course-1',
    videoId: 'video-1',
    title: 'اختبار الجبر الأساسي',
    type: 'video',
    duration: 15,
    questions: [
      {
        id: 'q1',
        text: 'ما هو حل المعادلة 2x + 4 = 10؟',
        options: ['x = 2', 'x = 3', 'x = 4', 'x = 5'],
        correctAnswer: 1
      },
      {
        id: 'q2',
        text: 'إذا كان y = 3x + 2، فما قيمة y عندما x = 4؟',
        options: ['10', '12', '14', '16'],
        correctAnswer: 2
      },
      {
        id: 'q3',
        text: 'ما هو ناتج تبسيط 5x + 3x - 2x؟',
        options: ['4x', '5x', '6x', '8x'],
        correctAnswer: 2
      }
    ],
    createdAt: '2024-01-01'
  },
  {
    id: 'quiz-2',
    courseId: 'course-1',
    title: 'الاختبار الشهري - يناير',
    type: 'monthly',
    duration: 60,
    questions: [
      {
        id: 'q1',
        text: 'حل المعادلة التربيعية x² - 5x + 6 = 0',
        options: ['x = 2, 3', 'x = 1, 6', 'x = -2, -3', 'x = -1, -6'],
        correctAnswer: 0
      },
      {
        id: 'q2',
        text: 'ما هو المقطع الصادي للدالة f(x) = 2x + 5؟',
        options: ['2', '5', '-5', '-2'],
        correctAnswer: 1
      }
    ],
    createdAt: '2024-01-15'
  }
]

export const mockAccessCodes: AccessCode[] = [
  {
    id: 'code-1',
    code: 'ABC123',
    courseId: 'course-1',
    studentId: 'student-1',
    isUsed: true,
    createdAt: '2024-01-01',
    usedAt: '2024-01-15'
  },
  {
    id: 'code-2',
    code: 'XYZ789',
    courseId: 'course-1',
    isUsed: false,
    createdAt: '2024-01-01'
  },
  {
    id: 'code-3',
    code: 'DEF456',
    courseId: 'course-2',
    studentId: 'student-2',
    isUsed: true,
    createdAt: '2024-02-01',
    usedAt: '2024-02-01'
  }
]

export const mockStudentProgress: StudentProgress[] = [
  {
    id: 'progress-1',
    studentId: 'student-1',
    courseId: 'course-1',
    completedVideos: ['video-1', 'video-2'],
    quizScores: [
      { quizId: 'quiz-1', score: 85, completedAt: '2024-01-20' }
    ]
  }
]

export const governorates = [
  'القاهرة',
  'الجيزة',
  'الإسكندرية',
  'الدقهلية',
  'البحر الأحمر',
  'البحيرة',
  'الفيوم',
  'الغربية',
  'الإسماعيلية',
  'المنوفية',
  'المنيا',
  'القليوبية',
  'الوادي الجديد',
  'السويس',
  'اسوان',
  'اسيوط',
  'بني سويف',
  'بورسعيد',
  'دمياط',
  'الشرقية',
  'جنوب سيناء',
  'كفر الشيخ',
  'مطروح',
  'الأقصر',
  'قنا',
  'شمال سيناء',
  'سوهاج'
]

export const grades = [
  { value: 'first', label: 'الصف الأول الثانوي' },
  { value: 'second', label: 'الصف الثاني الثانوي' },
  { value: 'third', label: 'الصف الثالث الثانوي' }
]
