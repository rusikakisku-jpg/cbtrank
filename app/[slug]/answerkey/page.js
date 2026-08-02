export const runtime = 'edge';

import AnswerKeyCalculatorPage from '@/app/answerkey/AnswerKeyClient';
import { firstD1, queryD1 } from '@/lib/d1';

export default async function ExamSlugAnswerKeyPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || '';
  
  let initialExam = null;
  let initialLanguages = [];

  if (slug) {
    try {
      // Fetch exam and its assigned languages in parallel
      [initialExam, ] = await Promise.all([
        firstD1('SELECT * FROM exams WHERE slug = ?', [slug]),
        Promise.resolve()
      ]);

      if (initialExam?.id) {
        initialLanguages = await queryD1(
          `SELECT DISTINCT l.id, l.name, l.slug
           FROM languages l
           INNER JOIN exam_languages el ON l.id = el.language_id
           WHERE el.exam_id = ? AND l.is_active = 1
           ORDER BY l.name ASC`,
          [initialExam.id]
        );
      }

      // Fallback: all languages if none assigned to this exam
      if (!initialLanguages || initialLanguages.length === 0) {
        initialLanguages = await queryD1(
          `SELECT DISTINCT id, name, slug FROM languages WHERE is_active = 1 ORDER BY name ASC`
        );
      }
    } catch (e) {
      console.error('Error fetching exam/languages server-side:', e);
    }
  }

  return (
    <AnswerKeyCalculatorPage
      params={resolvedParams}
      initialExam={initialExam}
      initialLanguages={initialLanguages}
    />
  );
}
