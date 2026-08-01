import { NextResponse } from 'next/server';
import { queryD1, firstD1 } from '@/lib/d1';

export async function GET() {
  try {
    const validUrlsRes = await firstD1('SELECT count(*) as count FROM valid_answerkey_urls');
    const invalidUrlsRes = await firstD1('SELECT count(*) as count FROM invalid_answerkey_urls');
    const examsCountRes = await firstD1('SELECT count(*) as count FROM exams');
    const blogsCountRes = await firstD1('SELECT count(*) as count FROM blogs');
    const recentExams = await queryD1('SELECT * FROM exams ORDER BY id DESC LIMIT 5');
    const recentBlogs = await queryD1('SELECT * FROM blogs ORDER BY id DESC LIMIT 5');

    return NextResponse.json({
      success: true,
      stats: {
        validUrls: validUrlsRes?.count || 0,
        invalidUrls: invalidUrlsRes?.count || 0,
        totalExams: examsCountRes?.count || 0,
        totalBlogs: blogsCountRes?.count || 0,
      },
      recentExams: recentExams || [],
      recentBlogs: recentBlogs || [],
      source: 'Cloudflare D1 Live Database'
    });

  } catch (error) {
    console.error('Dashboard Stats API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}

