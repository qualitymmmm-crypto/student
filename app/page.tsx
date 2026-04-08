'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Video, FileQuestion, Users, Award, Clock, ChevronLeft } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

export default function HomePage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg sm:text-xl">
              م
            </div>
            <span className="text-lg sm:text-xl font-bold">المهندس</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              المميزات
            </Link>
            <Link href="#courses" className="text-muted-foreground hover:text-foreground transition-colors">
              الكورسات
            </Link>
            <Link href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
              تواصل معنا
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            {user ? (
              <Button asChild size="sm" className="sm:size-default">
                <Link href={user.role === 'admin' ? '/admin' : '/student'}>
                  <span className="hidden sm:inline">لوحة التحكم</span>
                  <span className="sm:hidden">التحكم</span>
                  <ChevronLeft className="mr-1 sm:mr-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild size="sm" className="hidden sm:inline-flex">
                  <Link href="/login">تسجيل الدخول</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/register">
                    <span className="hidden sm:inline">إنشاء حساب</span>
                    <span className="sm:hidden">حساب</span>
                  </Link>
                </Button>
                <Button variant="ghost" asChild size="sm" className="sm:hidden">
                  <Link href="/login">دخول</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 sm:py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl text-balance">
              منصة <span className="text-primary">المهندس</span> التعليمية
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-muted-foreground md:text-xl text-pretty px-2">
              شرح مميز ومبسط لمادة الرياضيات للمرحلة الثانوية مع تمارين واختبارات تفاعلية
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0">
              <Button size="lg" asChild className="w-full sm:w-auto">
                <Link href="/register">
                  ابدأ الآن مجاناً
                  <ChevronLeft className="mr-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                <Link href="#courses">استعرض الكورسات</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/30 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary md:text-4xl">+1000</div>
              <div className="mt-1 text-xs sm:text-sm text-muted-foreground">طالب مسجل</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary md:text-4xl">+100</div>
              <div className="mt-1 text-xs sm:text-sm text-muted-foreground">فيديو تعليمي</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary md:text-4xl">+50</div>
              <div className="mt-1 text-xs sm:text-sm text-muted-foreground">اختبار تفاعلي</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary md:text-4xl">95%</div>
              <div className="mt-1 text-xs sm:text-sm text-muted-foreground">نسبة النجاح</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight md:text-4xl">مميزات المنصة</h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground">
              نقدم لك تجربة تعليمية متكاملة تساعدك على التفوق
            </p>
          </div>

          <div className="mt-10 sm:mt-16 grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Video className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="mt-4">فيديوهات مشروحة</CardTitle>
                <CardDescription>
                  شرح مفصل ومبسط لكل درس بطريقة سهلة الفهم
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <FileQuestion className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="mt-4">اختبارات تفاعلية</CardTitle>
                <CardDescription>
                  اختبارات بعد كل درس واختبارات شهرية لقياس مستواك
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="mt-4">متاح 24/7</CardTitle>
                <CardDescription>
                  ادرس في أي وقت يناسبك من أي مكان
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="mt-4">منهج شامل</CardTitle>
                <CardDescription>
                  تغطية كاملة لمنهج الرياضيات للمرحلة الثانوية
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="mt-4">شهادات إتمام</CardTitle>
                <CardDescription>
                  احصل على شهادة بعد إتمام كل كورس بنجاح
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="mt-4">دعم مستمر</CardTitle>
                <CardDescription>
                  تواصل مع المدرس للإجابة على استفساراتك
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="bg-muted/30 py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight md:text-4xl">الكورسات المتاحة</h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground">
              اختر الكورس المناسب لصفك الدراسي
            </p>
          </div>

          <div className="mt-10 sm:mt-16 grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 md:grid-cols-3">
            <Card className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <span className="text-4xl font-bold text-primary">1</span>
              </div>
              <CardContent className="p-6">
                <CardTitle>الصف الأول الثانوي</CardTitle>
                <CardDescription className="mt-2">
                  شرح شامل للجبر والهندسة وحساب المثلثات
                </CardDescription>
                <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Video className="h-4 w-4" />
                    24 فيديو
                  </span>
                  <span className="flex items-center gap-1">
                    <FileQuestion className="h-4 w-4" />
                    8 اختبارات
                  </span>
                </div>
                <Button className="mt-4 w-full" asChild>
                  <Link href="/register">سجل الآن</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-primary">
              <div className="aspect-video bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center relative">
                <span className="text-4xl font-bold text-primary">2</span>
                <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                  الأكثر طلباً
                </div>
              </div>
              <CardContent className="p-6">
                <CardTitle>الصف الثاني الثانوي</CardTitle>
                <CardDescription className="mt-2">
                  شرح شامل للتفاضل والتكامل والجبر
                </CardDescription>
                <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Video className="h-4 w-4" />
                    30 فيديو
                  </span>
                  <span className="flex items-center gap-1">
                    <FileQuestion className="h-4 w-4" />
                    10 اختبارات
                  </span>
                </div>
                <Button className="mt-4 w-full" asChild>
                  <Link href="/register">سجل الآن</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <span className="text-4xl font-bold text-primary">3</span>
              </div>
              <CardContent className="p-6">
                <CardTitle>الصف الثالث الثانوي</CardTitle>
                <CardDescription className="mt-2">
                  شرح شامل لمنهج الثانوية العامة
                </CardDescription>
                <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Video className="h-4 w-4" />
                    40 فيديو
                  </span>
                  <span className="flex items-center gap-1">
                    <FileQuestion className="h-4 w-4" />
                    15 اختبارات
                  </span>
                </div>
                <Button className="mt-4 w-full" asChild>
                  <Link href="/register">سجل الآن</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl rounded-2xl bg-primary p-6 sm:p-8 text-center text-primary-foreground md:p-12">
            <h2 className="text-xl sm:text-2xl font-bold md:text-3xl text-balance">
              ابدأ رحلتك نحو التفوق الآن
            </h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-primary-foreground/80">
              انضم لآلاف الطلاب الذين حققوا نتائج مميزة مع منصة المهندس
            </p>
            <Button size="lg" variant="secondary" className="mt-6 sm:mt-8 w-full sm:w-auto" asChild>
              <Link href="/register">
                إنشاء حساب مجاني
                <ChevronLeft className="mr-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t bg-muted/30 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 grid-cols-2 sm:grid-cols-2 md:grid-cols-4">
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg sm:text-xl">
                  م
                </div>
                <span className="text-lg sm:text-xl font-bold">المهندس</span>
              </div>
              <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-muted-foreground">
                منصة تعليمية متخصصة في شرح الرياضيات للمرحلة الثانوية
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-sm sm:text-base">روابط سريعة</h3>
              <ul className="mt-3 sm:mt-4 space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-foreground">المميزات</Link></li>
                <li><Link href="#courses" className="hover:text-foreground">الكورسات</Link></li>
                <li><Link href="/login" className="hover:text-foreground">تسجيل الدخول</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-sm sm:text-base">الصفوف الدراسية</h3>
              <ul className="mt-3 sm:mt-4 space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li>الصف الأول الثانوي</li>
                <li>الصف الثاني الثانوي</li>
                <li>الصف الثالث الثانوي</li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h3 className="font-semibold text-sm sm:text-base">تواصل معنا</h3>
              <ul className="mt-3 sm:mt-4 space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li>واتساب: 01008006562</li>
                <li>فيسبوك: @theengineer</li>
                <li>تيليجرام: @theengineer</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 border-t pt-6 sm:pt-8 text-center text-xs sm:text-sm text-muted-foreground">
            <p>جميع الحقوق محفوظة © {new Date().getFullYear()} منصة المهندس</p>
            <p className="mt-2">تصميم وتطوير: Mohamed Alaa</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
