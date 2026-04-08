import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, phone, parentPhone, governorate, grade } =
      await request.json()

    // Validate input
    if (!email || !password || !name || !phone || !governorate || !grade) {
      return NextResponse.json(
        { success: false, error: 'جميع الحقول مطلوبة' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'البريد الإلكتروني مسجل مسبقاً' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        parentPhone: parentPhone || '',
        governorate,
        grade,
        role: 'student',
      },
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json(
      { success: true, user: userWithoutPassword },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء التسجيل' },
      { status: 500 }
    )
  }
}
