import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // Get all PDFs for the username
    const pdfs = await prisma.pdfFile.findMany({
      where: { username },
      select: {
        id: true,
        filename: true,
        isProtected: true,
        username: true,
      },
      orderBy: { id: 'desc' }
    });

    if (pdfs.length === 0) {
      return NextResponse.json(
        { error: 'No PDFs found for this username' },
        { status: 404 }
      );
    }

    // Transform the data to include URLs and remove sensitive info
    const transformedPdfs = pdfs.map(pdf => ({
      id: pdf.id,
      filename: pdf.filename,
      username: pdf.username,
      isProtected: pdf.isProtected,
      url: `/api/pdf/${pdf.username}/${pdf.filename}`,
    }));

    return NextResponse.json({
      success: true,
      pdfs: transformedPdfs
    });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to search PDFs',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
