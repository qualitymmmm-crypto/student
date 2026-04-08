'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { governorates, grades } from '@/lib/mock-data'
import { User, Mail, Phone, MapPin, GraduationCap, Loader2, CheckCircle } from 'lucide-react'

export default function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    parentPhone: user?.parentPhone || '',
    governorate: user?.governorate || '',
    grade: user?.grade || ''
  })

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    setIsEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const gradeLabel = grades.find(g => g.value === user?.grade)?.label

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">حسابي</h1>
        <p className="text-muted-foreground">إدارة بيانات حسابك الشخصي</p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200">
          <CheckCircle className="h-5 w-5" />
          <span>تم حفظ التغييرات بنجاح</span>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>البيانات الشخصية</CardTitle>
              <CardDescription>معلوماتك الأساسية المسجلة في المنصة</CardDescription>
            </div>
            {!isEditing && (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                تعديل
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {isEditing ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم الكامل</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    value={user?.email}
                    disabled
                    className="bg-muted"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parentPhone">رقم ولي الأمر</Label>
                  <Input
                    id="parentPhone"
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="governorate">المحافظة</Label>
                  <Select value={formData.governorate} onValueChange={(v) => setFormData({ ...formData, governorate: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {governorates.map((gov) => (
                        <SelectItem key={gov} value={gov}>
                          {gov}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade">الصف الدراسي</Label>
                  <Select value={formData.grade} onValueChange={(v) => setFormData({ ...formData, grade: v })}>
                    <SelectTrigger>
                      <SelectValue />
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
              </div>

              <div className="flex gap-3">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                  حفظ التغييرات
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  إلغاء
                </Button>
              </div>
            </>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">الاسم</p>
                  <p className="font-medium">{user?.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
                  <p className="font-medium" dir="ltr">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">رقم الهاتف</p>
                  <p className="font-medium" dir="ltr">{user?.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">رقم ولي الأمر</p>
                  <p className="font-medium" dir="ltr">{user?.parentPhone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">المحافظة</p>
                  <p className="font-medium">{user?.governorate}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <GraduationCap className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">الصف الدراسي</p>
                  <p className="font-medium">{gradeLabel}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>الأمان</CardTitle>
          <CardDescription>إعدادات كلمة المرور والأمان</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline">تغيير كلمة المرور</Button>
        </CardContent>
      </Card>
    </div>
  )
}
