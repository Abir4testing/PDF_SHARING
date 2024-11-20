import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcryptjs';
import { promises as fs } from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { fileId, password } = await request.json();

    if (!fileId) {
      return NextResponse.json(
        { error: 'File ID is required' },
        { status: 400 }
      );
    }

    // Find the PDF record
    const pdf = await prisma.pdfFile.findUnique({
      where: { id: fileId }
    });

    if (!pdf) {
      return NextResponse.json(
        { error: 'PDF not found' },
        { status: 404 }
      );
    }

    // If PDF is password protected, verify the password
    if (pdf.password) {
      if (!password) {
        return NextResponse.json(
          { error: 'Password is required for this PDF' },
          { status: 400 }
        );
      }

      const isValid = await compare(password, pdf.password);
      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid password' },
          { status: 401 }
        );
      }
    }

    // Read the file
    const filePath = path.join(process.cwd(), 'uploads', pdf.filename);
    try {
      const fileBuffer = await fs.readFile(filePath);
      
      // Set appropriate headers for PDF file
      const headers = new Headers();
      headers.set('Content-Type', 'application/pdf');
      headers.set('Content-Disposition', `attachment; filename="${pdf.filename}"`);

      return new NextResponse(fileBuffer, {
        status: 200,
        headers,
      });
    } catch (error) {
      console.error('Error reading file:', error);
      return NextResponse.json(
        { error: 'File not found on server' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Failed to download file' },
      { status: 500 }
    );
  }
}
