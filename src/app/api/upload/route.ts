import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  try {
    console.log('Starting file upload process...');
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const username = formData.get('username') as string;
    const password = formData.get('password') as string | null;

    console.log('Received upload request:', {
      hasFile: !!file,
      username,
      hasPassword: !!password,
      fileSize: file?.size,
      fileName: file?.name
    });

    if (!file || !username) {
      return NextResponse.json(
        { error: 'File and username are required' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type || file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create user directory if it doesn't exist
    const userDir = path.join(process.cwd(), 'public', 'uploads', username);
    console.log('Creating user directory:', userDir);
    await mkdir(userDir, { recursive: true });
    console.log('User directory ready');

    // Generate safe filename
    const safeFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    console.log('Generated safe filename:', safeFilename);
    const filePath = path.join(userDir, safeFilename);

    // Save file to disk
    await writeFile(filePath, buffer);
    console.log('File saved to:', filePath);

    // Hash password if provided
    let hashedPassword = null;
    if (password) {
      console.log('Hashing password...');
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Save file metadata to database
    console.log('Saving file metadata to database...');
    const pdfFile = await prisma.pdfFile.create({
      data: {
        filename: safeFilename,
        username: username,
        isProtected: !!password,
        password: hashedPassword,
      },
    });
    console.log('File metadata saved:', pdfFile);

    // Generate file URL
    const fileUrl = `/uploads/${username}/${safeFilename}`;

    // Return the file URL and other metadata
    const response = {
      message: 'File uploaded successfully',
      filename: safeFilename,
      fileUrl,
      isProtected: !!password,
    };
    console.log('Sending response:', response);

    return NextResponse.json(response, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to upload file',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
