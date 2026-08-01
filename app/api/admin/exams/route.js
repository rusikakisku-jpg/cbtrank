import { NextResponse } from 'next/server';
import { queryD1 } from '@/lib/d1';

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

export async function GET() {
  try {
    const exams = await queryD1('SELECT * FROM exams ORDER BY id DESC');
    return NextResponse.json({ success: true, exams, source: 'Cloudflare D1 Live Database' });
  } catch (error) {
    console.error('Fetch Exams Error:', error);
    return NextResponse.json({ error: 'Failed to fetch exams' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      title,
      subtitle,
      exam_type = 'other',
      marks_right = 1.00,
      marks_wrong = 0.00,
      is_visible = 1,
      is_latest = 0,
      set_on_top = 0,
      location_type_id = null,
      location_id = null,
      answerkey_login_link = null,
      description = null,
      external_exam_id = null,
      youtube_link = null,
    } = body;

    if (!title) {
      return NextResponse.json({ error: 'Exam Title is required' }, { status: 400 });
    }

    const slug = slugify(title);

    const insertSql = `
      INSERT INTO exams (
        title, subtitle, slug, exam_type,
        marks_right, marks_wrong,
        is_visible, is_latest, set_on_top,
        location_type_id, location_id,
        answerkey_login_link, description,
        external_exam_id, youtube_link,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, DATETIME('now'), DATETIME('now'))
    `;

    const params = [
      title,
      subtitle || null,
      slug,
      exam_type,
      parseFloat(marks_right),
      parseFloat(marks_wrong),
      is_visible ? 1 : 0,
      is_latest ? 1 : 0,
      set_on_top ? 1 : 0,
      location_type_id || null,
      location_id || null,
      answerkey_login_link || null,
      description || null,
      external_exam_id || null,
      youtube_link || null
    ];

    await queryD1(insertSql, params);

    return NextResponse.json({
      success: true,
      message: 'Exam inserted successfully into Cloudflare D1 Database!',
      slug: slug
    });

  } catch (error) {
    console.error('Insert Exam API Error:', error);
    return NextResponse.json({ error: 'Failed to insert exam into database' }, { status: 500 });
  }
}

