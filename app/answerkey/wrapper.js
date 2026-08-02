export const runtime = 'edge';

import AnswerKeyCalculatorPage from './page';
import { queryD1 } from '@/lib/d1';

export default async function AnswerKeyServerWrapper() {
  let initialLanguages = [];
  try {
    initialLanguages = await queryD1(
      `SELECT DISTINCT id, name, slug FROM languages WHERE is_active = 1 ORDER BY name ASC`
    );
  } catch (e) {
    console.error('Error fetching languages server-side:', e);
  }

  return <AnswerKeyCalculatorPage params={{}} initialLanguages={initialLanguages} />;
}
