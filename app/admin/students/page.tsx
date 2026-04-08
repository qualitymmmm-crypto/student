'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { mockUsers, mockAccessCodes, mockCourses, grades, governorates } from '@/lib/mock-data'
import { Search } from 'lucide-react'

export default function StudentsPage() {
  const students = mockUsers.filter(u => u.role === 'student')
  const [searchQuery, setSearchQuery] = useState('')
  const [gradeFilter, setGradeFilter] = useState('all')
  const [governorateFilter, setGovernorateFilter] = useState('all')

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.includes(searchQuery) || 
                          student.email.includes(searchQuery) ||
                          student.phone.includes(searchQuery)
    const matchesGrade = gradeFilter === 'all' || student.grade === gradeFilter
    const matchesGovernorate = governorateFilter === 'all' || student.governorate === governorateFilter
    
    return matchesSearch && matchesGrade && matchesGovernorate
  })

  const getStudentCourses = (studentId: string) => {
    const codes = mockAccessCodes.filter(c => c.studentId === studentId && c.isUsed)
    return codes.map(c => mockCourses.find(course => course.id === c.courseId)?.title).filter(Boolean)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">الطلاب</h1>
        <p className="text-muted-foreground">إدارة بيانات الطلاب المسجلين</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="بحث بالاسم أو البريد أو الهاتف..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={gradeFilter} onValueChange={setGradeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="الصف الدراسي" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الصفوف</SelectItem>
                {grades.map((grade) => (
                  <SelectItem key={grade.value} value={grade.value}>
                    {grade.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={governorateFilter} onValueChange={setGovernorateFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="المحافظة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المحافظات</SelectItem>
                {governorates.map((gov) => (
                  <SelectItem key={gov} value={gov}>
                    {gov}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-muted-foreground">إجمالي الطلاب</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {students.filter(s => s.grade === 'third').length}
            </div>
            <p className="text-muted-foreground">طلاب الثانوية العامة</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{filteredStudents.length}</div>
            <p className="text-muted-foreground">نتائج البحث</p>
          </CardContent>
        </Card>
      </div>

      {/* Students Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الاسم</TableHead>
              <TableHead>البريد الإلكتروني</TableHead>
              <TableHead>الهاتف</TableHead>
              <TableHead>هاتف ولي الأمر</TableHead>
              <TableHead>الصف</TableHead>
              <TableHead>المحافظة</TableHead>
              <TableHead>الكورسات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student) => {
              const studentCourses = getStudentCourses(student.id)
              const gradeLabel = grades.find(g => g.value === student.grade)?.label || student.grade

              return (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell className="font-mono text-sm" dir="ltr">{student.email}</TableCell>
                  <TableCell className="font-mono text-sm" dir="ltr">{student.phone}</TableCell>
                  <TableCell className="font-mono text-sm" dir="ltr">{student.parentPhone}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{gradeLabel}</Badge>
                  </TableCell>
                  <TableCell>{student.governorate}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {studentCourses.length > 0 ? (
                        studentCourses.map((course, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {course}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-sm">لا توجد كورسات</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        {filteredStudents.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            لا توجد نتائج مطابقة للبحث
          </div>
        )}
      </Card>
    </div>
  )
}
