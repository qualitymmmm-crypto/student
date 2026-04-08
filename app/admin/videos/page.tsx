'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { mockCourses, mockVideos } from '@/lib/mock-data'
import type { Video } from '@/lib/types'
import { Plus, Pencil, Trash2, Play, GripVertical } from 'lucide-react'

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>(mockVideos)
  const [isOpen, setIsOpen] = useState(false)
  const [editingVideo, setEditingVideo] = useState<Video | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<string>('all')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    duration: '',
    courseId: ''
  })

  const filteredVideos = selectedCourse === 'all' 
    ? videos 
    : videos.filter(v => v.courseId === selectedCourse)

  const handleOpen = (video?: Video) => {
    if (video) {
      setEditingVideo(video)
      setFormData({
        title: video.title,
        description: video.description,
        url: video.url,
        duration: video.duration,
        courseId: video.courseId
      })
    } else {
      setEditingVideo(null)
      setFormData({ title: '', description: '', url: '', duration: '', courseId: '' })
    }
    setIsOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingVideo) {
      setVideos(videos.map(v => 
        v.id === editingVideo.id 
          ? { ...v, ...formData }
          : v
      ))
    } else {
      const courseVideos = videos.filter(v => v.courseId === formData.courseId)
      const newVideo: Video = {
        id: `video-${Date.now()}`,
        courseId: formData.courseId,
        title: formData.title,
        description: formData.description,
        url: formData.url,
        duration: formData.duration,
        order: courseVideos.length + 1,
        createdAt: new Date().toISOString()
      }
      setVideos([...videos, newVideo])
    }
    
    setIsOpen(false)
  }

  const handleDelete = (videoId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الفيديو؟')) {
      setVideos(videos.filter(v => v.id !== videoId))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">الفيديوهات</h1>
          <p className="text-muted-foreground">إدارة الفيديوهات التعليمية</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpen()}>
              <Plus className="ml-2 h-4 w-4" />
              إضافة فيديو
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingVideo ? 'تعديل الفيديو' : 'إضافة فيديو جديد'}</DialogTitle>
              <DialogDescription>
                {editingVideo ? 'قم بتعديل بيانات الفيديو' : 'أدخل بيانات الفيديو الجديد'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="courseId">الكورس</Label>
                  <Select value={formData.courseId} onValueChange={(v) => setFormData({ ...formData, courseId: v })}>
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
                  <Label htmlFor="title">عنوان الفيديو</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="مثال: مقدمة في الجبر"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">وصف الفيديو</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="وصف مختصر للفيديو"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url">رابط الفيديو (YouTube Embed)</Label>
                  <Input
                    id="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://www.youtube.com/embed/..."
                    required
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">مدة الفيديو</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="45:00"
                    required
                    dir="ltr"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  إلغاء
                </Button>
                <Button type="submit">
                  {editingVideo ? 'حفظ التغييرات' : 'إضافة الفيديو'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Label>تصفية حسب الكورس:</Label>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-64">
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
        </CardContent>
      </Card>

      {/* Videos Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>العنوان</TableHead>
              <TableHead>الكورس</TableHead>
              <TableHead>المدة</TableHead>
              <TableHead className="w-32">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVideos.map((video, index) => {
              const course = mockCourses.find(c => c.id === video.courseId)
              return (
                <TableRow key={video.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      {index + 1}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{video.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">{video.description}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{course?.title}</TableCell>
                  <TableCell className="font-mono">{video.duration}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <a href={video.url} target="_blank" rel="noopener noreferrer">
                          <Play className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleOpen(video)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(video.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        {filteredVideos.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            لا توجد فيديوهات
          </div>
        )}
      </Card>
    </div>
  )
}
