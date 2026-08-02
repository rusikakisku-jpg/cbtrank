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
      // TRUE PARALLEL: fetch exam AND languages by slug simultaneously
      const [examResult, langsBySlug] = await Promise.all([
        firstD1('SELECT * FROM exams WHERE slug = ?', [slug]),
        queryD1(
          `SELECT DISTINCT l.id, l.name, l.slug
           FROM languages l
           INNER JOIN exam_languages el ON l.id = el.language_id
           INNER JOIN exams e ON e.id = el.exam_id
           WHERE e.slug = ? AND l.is_active = 1
           ORDER BY l.name ASC`,
          [slug]
        )
      ]);

      initialExam = examResult;
      initialLanguages = langsBySlug || [];

      // Fallback: all languages if none assigned to this exam
      if (initialLanguages.length === 0) {
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
