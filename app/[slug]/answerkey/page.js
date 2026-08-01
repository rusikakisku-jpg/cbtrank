import AnswerKeyCalculatorPage from '../../answerkey/page';

export default async function ExamSlugAnswerKeyPage({ params }) {
  const resolvedParams = await params;
  return <AnswerKeyCalculatorPage params={resolvedParams} />;
}
