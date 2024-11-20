import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { fileId, password } = await request.json();

    if (!fileId || !password) {
      return NextResponse.json(
        { error: 'File ID and password are required' },
        { status: 400 }
      );
    }

    // Find the PDF record
    const pdf = await prisma.pDF.findUnique({
      where: { id: fileId }
    });

    if (!pdf) {
      return NextResponse.json(
        { error: 'PDF not found' },
        { status: 404 }
      );
    }

    if (!pdf.password) {
      return NextResponse.json(
        { error: 'This file is not password protected' },
        { status: 400 }
      );
    }

    // Verify password
    const isValid = await compare(password, pdf.password);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    return NextResponse.json({ 
      message: 'Password verified successfully',
      verified: true
    });
  } catch (error) {
    console.error('Password verification error:', error);
    return NextResponse.json(
      { error: 'Error verifying password' },
      { status: 500 }
    );
  }
}
