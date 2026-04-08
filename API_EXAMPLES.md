# 💻 أمثلة عملية لاستخدام الـ APIs

## استيراد المكتبات
```typescript
import { 
  courseAPI, 
  videoAPI, 
  quizAPI, 
  progressAPI,
  accessCodeAPI,
  quizAPI 
} from '@/lib/api-client'
```

---

## 📚 أمثلة الدورات

### جلب جميع الدورات
```typescript
const courses = await courseAPI.getAll()
console.log(courses) // [ {...}, {...}, ... ]
```

### إنشاء دورة جديدة (الأدمن)
```typescript
const newCourse = await courseAPI.create({
  title: 'الكيمياء - الصف الأول',
  description: 'شرح كامل لمنهج الكيمياء',
  grade: 'first',
  price: 450
})

console.log(newCourse.id) // يمكن استخدام الـ ID لاحقاً
```

### جلب دورة محددة مع الفيديوهات والاختبارات
```typescript
const course = await courseAPI.getById('course-123')
console.log(course.videos) // جميع الفيديوهات
console.log(course.quizzes) // جميع الاختبارات
```

### تحديث دورة
```typescript
const updated = await courseAPI.update('course-123', {
  title: 'الكيمياء - الصف الثاني',
  price: 500
})
```

### حذف دورة
```typescript
await courseAPI.delete('course-123')
```

---

## 🎬 أمثلة الفيديوهات

### إضافة فيديو إلى دورة
```typescript
const video = await videoAPI.add('course-123', {
  title: 'مقدمة في الكيمياء العضوية',
  description: 'شرح أساسيات الكيمياء العضوية',
  url: 'https://www.youtube.com/embed/...',
  duration: '45:30',
  order: 1
})

console.log(video.id) // معرف الفيديو
```

### تحديث فيديو
```typescript
const updated = await videoAPI.update(
  'course-123', 
  'video-456',
  {
    title: 'شرح محدّث للكيمياء العضوية',
    duration: '50:00'
  }
)
```

### حذف فيديو
```typescript
await videoAPI.delete('course-123', 'video-456')
```

---

## ✅ أمثلة الاختبارات

### إضافة اختبار إلى دورة
```typescript
const quiz = await quizAPI.add('course-123', {
  title: 'اختبار الكيمياء - الوحدة الأولى',
  type: 'video', // أو 'monthly' أو 'final'
  duration: 20, // بالدقائق
  videoId: 'video-456', // اختياري
  questions: [
    {
      id: 'q1',
      text: 'ما هي صيغة الماء؟',
      options: ['H2O', 'CO2', 'O2', 'N2'],
      correctAnswer: 0,
      imageUrl: null
    },
    {
      id: 'q2',
      text: 'ما هو وزن الأكسجين الذري؟',
      options: ['8', '16', '32', '4'],
      correctAnswer: 1
    }
  ]
})

console.log(quiz.id)
```

### تحديث اختبار
```typescript
const updated = await quizAPI.update('course-123', 'quiz-789', {
  title: 'اختبار محدّث',
  duration: 30
})
```

### حذف اختبار
```typescript
await quizAPI.delete('course-123', 'quiz-789')
```

---

## 📊 أمثلة نتائج الاختبارات

### حفظ نتيجة اختبار (بعد ما يحل الطالب)
```typescript
const result = await quizAPI.submitResult({
  quizId: 'quiz-789',
  studentId: 'student-123',
  score: 85, // النسبة المئوية
  answers: [0, 1, 1, 2] // الخيارات التي اختارها الطالب
})

console.log(result) // النتيجة محفوظة! ✅
```

### جلب نتائج الطالب لاختبار محدد
```typescript
const results = await quizAPI.getResults('student-123', 'quiz-789')
console.log(results) // جميع محاولات الطالب
```

### جلب جميع نتائج الطالب
```typescript
const allResults = await quizAPI.getResults('student-123')
console.log(allResults) // جميع اختباراته وجميع نتائجه
```

---

## 📈 أمثلة تقدم الطالب

### تحديث التقدم (فيديو شُوهِد)
```typescript
const progress = await progressAPI.update({
  studentId: 'student-123',
  courseId: 'course-123',
  completedVideos: ['video-1', 'video-2', 'video-3']
})
```

### جلب تقدم الطالب في دورة محددة
```typescript
const progress = await progressAPI.get('student-123', 'course-123')
console.log(progress.completedVideos) // الفيديوهات المشاهدة
```

### جلب تقدم الطالب في جميع الدورات
```typescript
const allProgress = await progressAPI.get('student-123')
console.log(allProgress) // تقدمه في كل الدورات
```

---

## 🔑 أمثلة رموز الوصول

### إنشاء رمز وصول جديد للدورة
```typescript
const code = await accessCodeAPI.create('course-123')
console.log(code.code) // COURSE-A1B2C3D4 (يظهر للطالب)
```

### جلب جميع الرموز للدورة
```typescript
const codes = await accessCodeAPI.getAll('course-123')
console.log(codes) // جميع الرموز المستخدمة والغير مستخدمة
```

### استخدام رمز وصول (الطالب يدخل الرمز)
```typescript
const used = await accessCodeAPI.use('course-123', {
  code: 'COURSE-A1B2C3D4',
  studentId: 'student-123'
})

if (used.success) {
  console.log('✅ تم تفعيل الدورة للطالب!')
}
```

---

## 🔄 مثال عملي كامل: إضافة دورة كاملة

```typescript
// 1. إنشاء الدورة
const course = await courseAPI.create({
  title: 'الرياضيات المتقدمة',
  description: 'دورة شاملة في الرياضيات',
  grade: 'third',
  price: 800
})

// 2. إضافة فيديوهات
const video1 = await videoAPI.add(course.id, {
  title: 'الدرس الأول',
  description: 'مقدمة',
  url: 'https://youtube.com/...',
  duration: '45:00',
  order: 1
})

const video2 = await videoAPI.add(course.id, {
  title: 'الدرس الثاني',
  description: 'تقدموا معنا',
  url: 'https://youtube.com/...',
  duration: '50:00',
  order: 2
})

// 3. إضافة اختبار بعد الفيديو الأول
const quiz = await quizAPI.add(course.id, {
  title: 'اختبار الوحدة الأولى',
  type: 'video',
  videoId: video1.id,
  duration: 15,
  questions: [
    {
      id: 'q1',
      text: 'السؤال الأول',
      options: ['خيار 1', 'خيار 2', 'خيار 3', 'خيار 4'],
      correctAnswer: 0
    }
  ]
})

// 4. إنشاء رموز وصول
const accessCode1 = await accessCodeAPI.create(course.id)
const accessCode2 = await accessCodeAPI.create(course.id)

console.log('الدورة الكاملة جاهزة!')
console.log(`الرموز: ${accessCode1.code}, ${accessCode2.code}`)

// الآن الطالب يمكنه استخدام الرمز والوصول للدورة كاملة! ✅
```

---

## 🎯 حالات استخدام شائعة

### حالة 1: الأدمن يضيف دورة مع محتوى
```typescript
// من صفحة الأدمن
const course = await courseAPI.create({...})
const video = await videoAPI.add(course.id, {...})
const quiz = await quizAPI.add(course.id, {...})
```

### حالة 2: الطالب يحل الاختبار
```typescript
// من صفحة الاختبار
const result = await quizAPI.submitResult({
  quizId: 'quiz-id',
  studentId: student.id,
  score: calculateScore(),
  answers: studentAnswers
})

// النتيجة محفوظة تلقائياً! ✅
```

### حالة 3: الطالب ينهي مشاهدة فيديو
```typescript
// من صفحة الفيديو
const progress = await progressAPI.get(studentId, courseId)
const completed = [...progress.completedVideos, videoId]

await progressAPI.update({
  studentId,
  courseId,
  completedVideos: completed
})
```

---

## ⚡ نصائح الأداء

### استخدم caching للبيانات الثابتة
```typescript
// بدلاً من استدعاء الـ API في كل مرة
import { useMemo } from 'react'

export function CourseList() {
  const courses = useMemo(() => courseAPI.getAll(), [])
  return courses
}
```

### قم بالعمليات على الخادم (Backend)
```typescript
// احسب النتيجة على الخادم وليس في المتصفح
const result = await quizAPI.submitResult({
  // الخادم يحسبها تلقائياً
  answers: studentAnswers
})
```

---

## 🔗 الملفات المرتبطة
- [API Client (`lib/api-client.ts`)](./lib/api-client.ts)
- [Auth Context (`lib/auth-context.tsx`)](./lib/auth-context.tsx)
- [Prisma Schema (`prisma/schema.prisma`)](./prisma/schema.prisma)

---

**الآن لديك جميع الأدوات لبناء النظام!** 🚀
