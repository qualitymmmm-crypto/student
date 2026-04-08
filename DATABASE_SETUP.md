# نظام الحفظ والقاعدة البيانات

## 📋 نظرة عامة

تم إضافة قاعدة بيانات SQLite كاملة مع API endpoints لحفظ جميع البيانات بشكل دائم. الآن عند عمل refresh، جميع التغييرات التي تم عملها من قِبل الأدمن والطلاب تبقى محفوظة.

## 🗄️ هيكل قاعدة البيانات

المشروع يستخدم **Prisma ORM** مع **SQLite**:

### الجداول الرئيسية:
- **User**: المستخدمين (طلاب وأدمن)
- **Course**: الدورات التعليمية
- **Video**: الفيديوهات
- **Quiz**: الاختبارات والأسئلة
- **AccessCode**: رموز الوصول للدورات
- **StudentProgress**: تقدم الطالب
- **QuizResult**: نتائج الاختبارات

## 🚀 البدء

### 1. تثبيت المكتبات
```bash
npm install @prisma/client prisma bcryptjs
```

### 2. إنشاء قاعدة البيانات
```bash
npx prisma migrate dev --name init
```

### 3. ملء البيانات الأولية
```bash
npx prisma db seed
```

## 📡 API Endpoints

### المصادقة
- `POST /api/auth/login` - تسجيل الدخول
- `POST /api/auth/register` - التسجيل

### الدورات
- `GET /api/courses` - جلب جميع الدورات
- `POST /api/courses` - إنشاء دورة جديدة (أدمن فقط)
- `GET /api/courses/[courseId]` - جلب دورة محددة
- `PUT /api/courses/[courseId]` - تحديث الدورة
- `DELETE /api/courses/[courseId]` - حذف الدورة

### الفيديوهات
- `POST /api/courses/[courseId]/videos` - إضافة فيديو
- `PUT /api/courses/[courseId]/videos/[videoId]` - تحديث فيديو
- `DELETE /api/courses/[courseId]/videos/[videoId]` - حذف فيديو

### الاختبارات
- `POST /api/courses/[courseId]/quizzes` - إضافة اختبار
- `PUT /api/courses/[courseId]/quizzes/[quizId]` - تحديث اختبار
- `DELETE /api/courses/[courseId]/quizzes/[quizId]` - حذف اختبار
- `POST /api/quiz/results` - حفظ نتيجة اختبار
- `GET /api/quiz/results?studentId=...` - جلب نتائج الطالب

### تقدم الطالب
- `POST /api/student/progress` - تحديث التقدم
- `GET /api/student/progress?studentId=...` - جلب التقدم

### رموز الوصول
- `POST /api/courses/[courseId]/access-codes` - إنشاء رمز وصول
- `GET /api/courses/[courseId]/access-codes` - جلب الرموز
- `PUT /api/courses/[courseId]/access-codes` - استخدام رمز

## 💻 استخدام API Client

```typescript
import { courseAPI, videoAPI, quizAPI, progressAPI } from '@/lib/api-client'

// جلب الدورات
const courses = await courseAPI.getAll()

// إضافة فيديو
const video = await videoAPI.add('courseId', {
  title: 'العنوان',
  description: 'الوصف',
  url: 'رابط الفيديو',
  duration: '45:00',
  order: 1
})

// حفظ نتيجة اختبار
const result = await quizAPI.submitResult({
  quizId: 'quiz-id',
  studentId: 'student-id',
  score: 85,
  answers: [0, 1, 2]
})

// تحديث تقدم الطالب
const progress = await progressAPI.update({
  studentId: 'student-id',
  courseId: 'course-id',
  completedVideos: ['video-1', 'video-2']
})
```

## 🔐 المستخدمين التجريبيين

**أدمن:**
- Email: admin@theengineer.com
- Password: admin123

**طالب:**
- Email: student@test.com
- Password: student123

- Email: sara@test.com
- Password: student123

## 🌐 النشر على الإنترنت

عند النشر على الإنترنت:

1. غير قاعدة البيانات إلى **PostgreSQL**:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. قم بتعيين `DATABASE_URL` في متغيرات البيئة (Vercel, Netlify, إلخ):
```
DATABASE_URL=postgresql://user:password@host/db_name
```

3. شغل migrations:
```bash
npx prisma migrate deploy
```

4. ملء البيانات الأولية (إذا لزم الأمر):
```bash
npx prisma db seed
```

## 📚 ملفات مهمة

- `prisma/schema.prisma` - تعريف قاعدة البيانات
- `lib/prisma.ts` - اتصال Prisma
- `lib/api-client.ts` - مساعد API
- `lib/auth-context.tsx` - سياق المصادقة المحدث
- `app/api/` - جميع API endpoints

## ✅ الميزات الجديدة

✅ حفظ دائم للبيانات
✅ البيانات باقية عند عمل refresh
✅ مشاركة البيانات بين الأدمن والطلاب
✅ تتبع دقيق لتقدم الطالب
✅ حفظ نتائج الاختبارات
✅ رموز وصول للدورات
✅ آمان كامل مع bcrypt

## 🐛 استكشاف الأخطاء

إذا حدثت مشاكل:

1. تأكد من وجود `DATABASE_URL` في `.env.local`:
```
DATABASE_URL="file:./dev.db"
```

2. إعادة تشغيل السيرفر:
```bash
npm run dev
```

3. إعادة تعيين قاعدة البيانات (حذف البيانات الحالية):
```bash
rm prisma/dev.db
npx prisma migrate dev --name init
npx prisma db seed
```
