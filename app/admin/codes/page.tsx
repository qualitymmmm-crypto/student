'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { mockCourses, mockAccessCodes, mockUsers } from '@/lib/mock-data'
import type { AccessCode } from '@/lib/types'
import { Plus, Copy, Check, Key } from 'lucide-react'

function generateCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export default function CodesPage() {
  const [codes, setCodes] = useState<AccessCode[]>(mockAccessCodes)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState('')
  const [codeCount, setCodeCount] = useState('1')
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([])
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [filterCourse, setFilterCourse] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredCodes = codes.filter(code => {
    const matchesCourse = filterCourse === 'all' || code.courseId === filterCourse
    const matchesStatus = filterStatus === 'all' || 
                          (filterStatus === 'used' && code.isUsed) ||
                          (filterStatus === 'unused' && !code.isUsed)
    return matchesCourse && matchesStatus
  })

  const handleGenerate = () => {
    if (!selectedCourse) {
      alert('يرجى اختيار الكورس')
      return
    }

    const count = Math.min(Math.max(1, parseInt(codeCount) || 1), 100)
    const newCodes: AccessCode[] = []
    const newCodeStrings: string[] = []

    for (let i = 0; i < count; i++) {
      let code = generateCode()
      // Ensure unique code
      while (codes.some(c => c.code === code) || newCodes.some(c => c.code === code)) {
        code = generateCode()
      }
      
      newCodes.push({
        id: `code-${Date.now()}-${i}`,
        code,
        courseId: selectedCourse,
        isUsed: false,
        createdAt: new Date().toISOString()
      })
      newCodeStrings.push(code)
    }

    setCodes([...codes, ...newCodes])
    setGeneratedCodes(newCodeStrings)
  }

  const handleCopy = async (code: string) => {
    await navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(generatedCodes.join('\n'))
    setCopiedCode('all')
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const handleClose = () => {
    setIsOpen(false)
    setGeneratedCodes([])
    setSelectedCourse('')
    setCodeCount('1')
  }

  const unusedCodes = codes.filter(c => !c.isUsed).length
  const usedCodes = codes.filter(c => c.isUsed).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">أكواد التفعيل</h1>
          <p className="text-muted-foreground">إدارة أكواد الوصول للكورسات</p>
        </div>
        <Dialog open={isOpen} onOpenChange={(open) => open ? setIsOpen(true) : handleClose()}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="ml-2 h-4 w-4" />
              توليد أكواد
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>توليد أكواد تفعيل جديدة</DialogTitle>
              <DialogDescription>
                اختر الكورس وعدد الأكواد المطلوبة
              </DialogDescription>
            </DialogHeader>
            
            {generatedCodes.length === 0 ? (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="course">الكورس</Label>
                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
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
                  <Label htmlFor="count">عدد الأكواد</Label>
                  <Input
                    id="count"
                    type="number"
                    min="1"
                    max="100"
                    value={codeCount}
                    onChange={(e) => setCodeCount(e.target.value)}
                    dir="ltr"
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={handleClose}>
                    إلغاء
                  </Button>
                  <Button onClick={handleGenerate}>
                    <Key className="ml-2 h-4 w-4" />
                    توليد
                  </Button>
                </DialogFooter>
              </div>
            ) : (
              <div className="space-y-4 py-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    تم توليد {generatedCodes.length} كود بنجاح
                  </p>
                  <Button variant="outline" size="sm" onClick={handleCopyAll}>
                    {copiedCode === 'all' ? (
                      <Check className="ml-2 h-4 w-4" />
                    ) : (
                      <Copy className="ml-2 h-4 w-4" />
                    )}
                    نسخ الكل
                  </Button>
                </div>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {generatedCodes.map((code) => (
                    <div
                      key={code}
                      className="flex items-center justify-between rounded-lg border p-2"
                    >
                      <code className="font-mono text-lg">{code}</code>
                      <Button variant="ghost" size="sm" onClick={() => handleCopy(code)}>
                        {copiedCode === code ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
                <DialogFooter>
                  <Button onClick={handleClose}>تم</Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{codes.length}</div>
            <p className="text-muted-foreground">إجمالي الأكواد</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{unusedCodes}</div>
            <p className="text-muted-foreground">أكواد متاحة</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">{usedCodes}</div>
            <p className="text-muted-foreground">أكواد مستخدمة</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex-1">
              <Label className="mb-2 block">تصفية حسب الكورس</Label>
              <Select value={filterCourse} onValueChange={setFilterCourse}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الكورسات</SelectItem>
                  {mockCourses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label className="mb-2 block">تصفية حسب الحالة</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="unused">متاح</SelectItem>
                  <SelectItem value="used">مستخدم</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Codes Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الكود</TableHead>
              <TableHead>الكورس</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>الطالب</TableHead>
              <TableHead>تاريخ الإنشاء</TableHead>
              <TableHead>تاريخ الاستخدام</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCodes.map((code) => {
              const course = mockCourses.find(c => c.id === code.courseId)
              const student = code.studentId ? mockUsers.find(u => u.id === code.studentId) : null

              return (
                <TableRow key={code.id}>
                  <TableCell>
                    <code className="font-mono font-bold text-lg">{code.code}</code>
                  </TableCell>
                  <TableCell>{course?.title}</TableCell>
                  <TableCell>
                    <Badge variant={code.isUsed ? 'secondary' : 'default'}>
                      {code.isUsed ? 'مستخدم' : 'متاح'}
                    </Badge>
                  </TableCell>
                  <TableCell>{student?.name || '-'}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(code.createdAt).toLocaleDateString('ar-EG')}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {code.usedAt ? new Date(code.usedAt).toLocaleDateString('ar-EG') : '-'}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        {filteredCodes.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            لا توجد أكواد مطابقة للبحث
          </div>
        )}
      </Card>
    </div>
  )
}
