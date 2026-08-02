export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { queryD1 } from '@/lib/d1';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const examId = searchParams.get('exam_id');
    const slug = searchParams.get('slug');

    let languages = [];

    if (examId) {
      // Smart filtering: fetch only DISTINCT languages assigned to this exam
      languages = await queryD1(
        `SELECT DISTINCT l.id, l.name, l.slug
         FROM languages l
         INNER JOIN exam_languages el ON l.id = el.language_id
         WHERE el.exam_id = ? AND l.is_active = 1
         ORDER BY l.name ASC`,
        [examId]
      );
    } else if (slug) {
      // Fetch exam_id from slug first, then get DISTINCT assigned languages
      const examRows = await queryD1(
        `SELECT id FROM exams WHERE slug = ? LIMIT 1`,
        [slug]
      );
      if (examRows && examRows.length > 0) {
        languages = await queryD1(
          `SELECT DISTINCT l.id, l.name, l.slug
           FROM languages l
           INNER JOIN exam_languages el ON l.id = el.language_id
           WHERE el.exam_id = ? AND l.is_active = 1
           ORDER BY l.name ASC`,
          [examRows[0].id]
        );
      }
    }

    // Fallback OR direct /answerkey access: return all active languages
    if (!languages || languages.length === 0) {
      languages = await queryD1(
        `SELECT DISTINCT id, name, slug FROM languages WHERE is_active = 1 ORDER BY name ASC`
      );
    }

    return NextResponse.json({ success: true, languages });
  } catch (error) {
    console.error('Languages API Error:', error);
    return NextResponse.json({ success: false, languages: [] }, { status: 500 });
  }
}
