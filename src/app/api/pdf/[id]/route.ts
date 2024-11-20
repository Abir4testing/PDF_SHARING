import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // In a real application, you would:
    // 1. Validate the user's access to this PDF
    // 2. Get the PDF file path from your database
    // 3. Implement proper security checks
    
    // For now, we'll serve from a pdfs directory in public
    const pdfPath = path.join(process.cwd(), 'public', 'pdfs', `${id}.pdf`);
    
    try {
      const pdfBuffer = await fs.readFile(pdfPath);
      
      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `inline; filename="${id}.pdf"`,
        },
      });
    } catch (error) {
      return NextResponse.json(
        { error: 'PDF not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
