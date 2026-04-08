import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// POST update student progress
export async function POST(request: NextRequest) {
  try {
    const { studentId, courseId, completedVideos } = await request.json()

    if (!studentId || !courseId) {
      return NextResponse.json(
        { success: false, error: 'معرف الطالب والدورة مطلوبان' },
        { status: 400 }
      )
    }

    const progress = await prisma.studentProgress.upsert({
      where: {
        studentId_courseId: { studentId, courseId },
      },
      update: {
        completedVideos: completedVideos || [],
      },
      create: {
        studentId,
        courseId,
        completedVideos: completedVideos || [],
      },
    })

    return NextResponse.json({ success: true, data: progress })
  } catch (error) {
    console.error('Error updating student progress:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء تحديث التقدم' },
      { status: 500 }
    )
  }
}

// GET student progress
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const studentId = searchParams.get('studentId')
    const courseId = searchParams.get('courseId')

    if (!studentId) {
      return NextResponse.json(
        { success: false, error: 'معرف الطالب مطلوب' },
        { status: 400 }
      )
    }

    const where = { studentId }
    if (courseId) {
      Object.assign(where, { courseId })
    }

    const progress = await prisma.studentProgress.findMany({
      where,
    })

    return NextResponse.json({ success: true, data: progress })
  } catch (error) {
    console.error('Error fetching student progress:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء جلب التقدم' },
      { status: 500 }
    )
  }
}
