# 📝 كيفية تحديث كود الأدمن لاستخدام قاعدة البيانات

## المشكلة الحالية
صفحة الأدمن تستخدم `mock-data` التي تُحذف عند عمل refresh

## الحل
استخدام الـ APIs الجديدة للحصول على البيانات من قاعدة البيانات

---

## مثال: تحديث صفحة Dashboard

### الكود القديم ❌
```typescript
'use client'

import { mockCourses, mockVideos, mockQuizzes, mockUsers, mockAccessCodes } from '@/lib/mock-data'

export default function AdminDashboard() {
  const students = mockUsers.filter(u => u.role === 'student')
  const usedCodes = mockAccessCodes.filter(c => c.isUsed)
  
  // البيانات هنا ثابتة ولا تتحدث عند refresh
  const stats = [
    { label: 'الكورسات', value: mockCourses.length },
    // ...
  ]
  
  return (...)
}
```

### الكود الجديد ✅
```typescript
'use client'

import { useEffect, useState } from 'react'
import { courseAPI, accessCodeAPI } from '@/lib/api-client'

export default function AdminDashboard() {
  const [courses, setCourses] = useState([])
  const [accessCodes, setAccessCodes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        // جلب البيانات من قاعدة البيانات
        const coursesData = await courseAPI.getAll()
        setCourses(coursesData.data || [])

        // حساب الإحصائيات
        const allCodes = await Promise.all(
          coursesData.data.map(c => accessCodeAPI.getAll(c.id))
        )
        const codes = allCodes.flat().filter(c => c.isUsed)
        setAccessCodes(codes)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const stats = [
    { label: 'الكورسات', value: courses.length },
    { label: 'الأكواد المستخدمة', value: accessCodes.length },
    // ...
  ]

  if (loading) return <p>جاري التحميل...</p>

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardTitle>{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

---

## مراحل التحديث

### 1️⃣ استبدال الـ Imports
```typescript
// القديم ❌
import { mockCourses, mockUsers } from '@/lib/mock-data'

// الجديد ✅
import { courseAPI } from '@/lib/api-client'
```

### 2️⃣ استخدام useState لحفظ البيانات
```typescript
const [courses, setCourses] = useState([])
const [loading, setLoading] = useState(true)
```

### 3️⃣ استخدام useEffect لجلب البيانات
```typescript
useEffect(() => {
  const fetchData = async () => {
    const data = await courseAPI.getAll()
    setCourses(data.data)
    setLoading(false)
  }
  fetchData()
}, [])
```

### 4️⃣ التعامل مع الحالات
```typescript
if (loading) return <LoadingSpinner />
if (!courses.length) return <EmptyState />

return (
  // عرض البيانات من قاعدة البيانات
)
```

---

## أمثلة عملية

### إضافة دورة جديدة
```typescript
const [newCourseTitle, setNewCourseTitle] = useState('')

const handleAddCourse = async () => {
  const course = await courseAPI.create({
    title: newCourseTitle,
    description: 'وصف الدورة',
    grade: 'first',
    price: 500
  })
  
  // تحديث القائمة مباشرة
  setCourses([...courses, course.data])
  setNewCourseTitle('')
}
```

### حذف دورة
```typescript
const handleDeleteCourse = async (courseId) => {
  await courseAPI.delete(courseId)
  
  // تحديث القائمة بحذف الدورة المحذوفة
  setCourses(courses.filter(c => c.id !== courseId))
}
```

### عرض الدورات المحدثة
```typescript
return (
  <div className="space-y-4">
    {courses.map((course) => (
      <CourseCard 
        key={course.id} 
        course={course}
        onDelete={handleDeleteCourse}
      />
    ))}
  </div>
)
```

---

## ✅ الفوائد

- ✅ البيانات تُحدّث من قاعدة البيانات
- ✅ عند عمل refresh، تُحمّل البيانات الجديدة
- ✅ جميع التعديلات محفوظة
- ✅ مشاركة البيانات بين جميع الأدمن والطلاب

---

## 🔄 دورة الحياة في الصفحة

```
1. المكون يُحمّل
   ↓
2. useEffect يجلب البيانات من الـ API
   ↓
3. البيانات تُخزّن في state
   ↓
4. المكون يُعاد رسمه مع البيانات الحديثة
   ↓
5. المستخدم يضغط Refresh
   ↓
6. المكون يُحمّل من جديد
   ↓
7. البيانات الحالية تُحمّل من قاعدة البيانات ✅
```

---

## 🎯 نموذج كامل لصفحة الأدمن

```typescript
'use client'

import { useEffect, useState } from 'react'
import { courseAPI } from '@/lib/api-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function AdminDashboard() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // جلب البيانات عند تحميل المكون
  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const response = await courseAPI.getAll()
      setCourses(response.data || [])
    } catch (err) {
      setError('فشل في تحميل الدورات')
    } finally {
      setLoading(false)
    }
  }

  const handleAddCourse = async () => {
    const newCourse = await courseAPI.create({
      title: 'دورة جديدة',
      description: 'الوصف',
      grade: 'first',
      price: 500
    })
    setCourses([...courses, newCourse.data])
  }

  const handleDelete = async (courseId) => {
    await courseAPI.delete(courseId)
    setCourses(courses.filter(c => c.id !== courseId))
  }

  if (loading) return <div>جاري التحميل...</div>
  if (error) return <div className="text-red-600">{error}</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">لوحة التحكم</h1>
        <Button onClick={handleAddCourse}>إضافة دورة</Button>
      </div>

      <div className="grid gap-4">
        {courses.map((course) => (
          <Card key={course.id}>
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{course.description}</p>
              <Button 
                onClick={() => handleDelete(course.id)}
                variant="destructive"
              >
                حذف
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

---

## 🚀 الخطوة التالية

قم بتحديث جميع صفحات الأدمن:
- `app/admin/courses/page.tsx`
- `app/admin/videos/page.tsx`
- `app/admin/quizzes/page.tsx`
- `app/admin/students/page.tsx`
- `app/admin/codes/page.tsx`

استخدم نفس النمط والـ APIs الموجودة! 🎉

---

**الآن جميع الصفحات ستستخدم قاعدة البيانات الحقيقية!** ✨
