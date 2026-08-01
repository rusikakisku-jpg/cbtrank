import Link from 'next/link';

export const metadata = {
  title: 'Blog Article - CBT RANK',
  description: 'Read detailed exam analysis and normalization breakdown on CBT RANK.',
};

export default function SingleBlogPage({ params }) {
  return (
    <div className="w-[95%] max-w-[900px] mx-auto py-8 space-y-6">
      <Link href="/blogs" className="text-xs font-bold text-[#0b69ff] hover:underline inline-flex items-center gap-1">
        &larr; Back to all articles
      </Link>

      <article className="bg-white border border-[#e2e8f0] rounded-2xl p-6 sm:p-10 shadow-sm space-y-6">
        <span className="bg-blue-100 text-[#0044cc] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Exam Analysis
        </span>
        
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0f172a] leading-tight">
          RRB NTPC CBT-2 Cutoff Marks & Score Normalization Process Explained
        </h1>

        <div className="flex items-center gap-4 text-xs text-[#64748b] border-b border-slate-100 pb-4">
          <span>By CBT RANK Team</span>
          <span>•</span>
          <span>🕒 Published on 01 Aug 2026</span>
        </div>

        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4 text-base">
          <p>
            When multi-shift exams take place in Indian competitive examinations like Railway Recruitment Boards (RRB) or Staff Selection Commission (SSC), the difficulty level across shifts can vary. To ensure fairness, standard deviation normalization formulas are applied.
          </p>

          <h3 className="text-xl font-bold text-[#0b69ff] pt-2">Key Calculation Factors:</h3>
          <ul className="list-disc pl-6 space-y-1.5 text-sm">
            <li>Mean and Standard Deviation of top candidates across all shifts.</li>
            <li>Mean raw score of candidates in your specific shift.</li>
            <li>Sum of mean and standard deviation of raw marks of candidates in the shift.</li>
          </ul>

          <p>
            By submitting your response key on CBT RANK, our automated system calculates these values instantly to give you a reliable rank prediction.
          </p>
        </div>
      </article>
    </div>
  );
}
