import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const fileExt = path.extname(file.name) || '.png';
    const fileName = `upload_${Date.now()}_${Math.random().toString(36).substring(2, 7)}${fileExt}`;

    // Cloudflare R2 Upload if available in environment
    if (process.env.R2_BUCKET) {
      await process.env.R2_BUCKET.put(`uploads/${fileName}`, buffer, {
        httpMetadata: { contentType: file.type || 'image/png' },
      });
      return NextResponse.json({ 
        success: true, 
        url: `/uploads/${fileName}`,
        storage: 'Cloudflare R2'
      });
    }

    // Local Disk Fallback
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    return NextResponse.json({ 
      success: true, 
      url: `/uploads/${fileName}`,
      storage: 'Local Server Disk'
    });

  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
