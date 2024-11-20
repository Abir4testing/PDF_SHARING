import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { promises as fs } from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest, { params }: { params: { params: string[] } }) {
  try {
    if (!params.params || params.params.length < 2) {
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 }
      );
    }

    const [username, filename] = params.params;
    const decodedFilename = decodeURIComponent(filename);
    
    console.log('Fetching PDF:', { username, filename: decodedFilename });

    // Find the PDF file in the database
    const pdfFile = await prisma.pdfFile.findFirst({
      where: {
        username: username,
        filename: decodedFilename,
      },
    });

    if (!pdfFile) {
      console.error('PDF file not found in database:', { username, filename: decodedFilename });
      return NextResponse.json(
        { error: 'PDF file not found' },
        { status: 404 }
      );
    }

    // Check password if file is protected
    const password = request.nextUrl.searchParams.get('password');
    if (pdfFile.isProtected) {
      if (!password) {
        return NextResponse.json(
          { error: 'Password required' },
          { status: 401 }
        );
      }

      const passwordMatch = await bcrypt.compare(password, pdfFile.password || '');
      if (!passwordMatch) {
        return NextResponse.json(
          { error: 'Invalid password' },
          { status: 401 }
        );
      }
    }

    // Construct the file path
    const filePath = path.join(process.cwd(), 'public', 'uploads', username, decodedFilename);
    
    try {
      // Check if file exists
      await fs.access(filePath);
      
      // Read file
      const fileBuffer = await fs.readFile(filePath);
      
      // Return file with proper headers
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `inline; filename="${decodedFilename}"`,
          'Content-Length': fileBuffer.length.toString(),
        },
      });
    } catch (error) {
      console.error('File access error:', error);
      return NextResponse.json(
        { error: 'File not found on server' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
