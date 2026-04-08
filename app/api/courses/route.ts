import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// GET all courses
export async function GET() {
  try {
    const courses = await prisma.course.findMany()
    return NextResponse.json({ success: true, data: courses })
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء جلب الدورات' },
      { status: 500 }
    )
  }
}

// POST new course (admin only)
export async function POST(request: NextRequest) {
  try {
    const { title, description, grade, thumbnail, price } =
      await request.json()

    if (!title || !description || !grade) {
      return NextResponse.json(
        { success: false, error: 'العنوان والوصف والصف مطلوبة' },
        { status: 400 }
      )
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        grade,
        thumbnail: thumbnail || null,
        price: price || 0,
      },
    })

    return NextResponse.json(
      { success: true, data: course },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating course:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء إنشاء الدورة' },
      { status: 500 }
    )
  }
}
