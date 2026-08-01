import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ category: string; file: string }> }
) {
  const { category, file } = await params;
  
  // Prevent directory traversal attacks
  if (category.includes('..') || file.includes('..')) {
    return new NextResponse('Invalid path', { status: 400 });
  }

  const filePath = path.join(process.cwd(), 'documentation', category, 'images', file);

  if (!fs.existsSync(filePath)) {
    return new NextResponse('Not found', { status: 404 });
  }

  const imageBuffer = fs.readFileSync(filePath);
  
  const ext = path.extname(file).toLowerCase();
  let contentType = 'image/jpeg';
  if (ext === '.png') contentType = 'image/png';
  if (ext === '.gif') contentType = 'image/gif';
  if (ext === '.webp') contentType = 'image/webp';
  if (ext === '.svg') contentType = 'image/svg+xml';

  return new NextResponse(imageBuffer, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400'
    },
  });
}
