export const runtime = 'edge';

import AnswerKeyCalculatorPage from '../../answerkey/page';
import { firstD1 } from '@/lib/d1';

export default async function ExamSlugAnswerKeyPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || '';
  
  let initialExam = null;
  if (slug) {
    try {
      initialExam = await firstD1('SELECT * FROM exams WHERE slug = ?', [slug]);
    } catch (e) {
      console.error('Error fetching exam server-side:', e);
    }
  }

  return <AnswerKeyCalculatorPage params={resolvedParams} initialExam={initialExam} />;
}
