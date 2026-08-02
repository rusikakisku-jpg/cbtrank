export const runtime = 'edge';

export const metadata = {
  title: 'About Us - CBT RANK',
  description: 'Learn about CBT RANK, an automated educational utility platform designed to help government exam aspirants evaluate performance and rank standing.',
};

export default function AboutUsPage() {
  return (
    <div className="w-[98%] max-w-[1200px] mx-auto px-2.5 py-6">
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
        
        <h1 className="text-3xl sm:text-4xl font-bold text-[#0b69ff] text-center">
          About Us
        </h1>

        <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
          Welcome to <strong>CBT RANK</strong>. We are a dedicated educational utility platform designed to help government exam aspirants evaluate their performance and understand their standing among peers.
        </p>

        <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
          Our platform offers an automated <strong>Computer-Based Test (CBT) score and rank calculator</strong>. By simply submitting their official answer key link, candidates can instantly retrieve a comprehensive analysis of their exam performance.
        </p>

        <div className="space-y-2">
          <p className="text-base font-semibold text-slate-800">
            Our system automatically processes the data to calculate:
          </p>
          <ul className="list-disc pl-6 space-y-2.5 text-base text-slate-700 leading-relaxed">
            <li><strong>Subject-Wise Analysis:</strong> Get detailed breakdowns of marks secured in each specific subject or section.</li>
            <li><strong>Detailed Performance Metrics:</strong> View the exact count of attempted, unattempted, correct, and incorrect answers.</li>
            <li><strong>Automated Score Calculation:</strong> Automatically compute final marks secured based on official marking schemes.</li>
            <li><strong>Indicative Ranking:</strong> Compare scores with other users who submitted their answer keys to see estimated overall, category, and shift-wise rankings.</li>
          </ul>
        </div>

        <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
          All calculations and analyses are <strong>100% program-driven and performed automatically</strong> by our system without any manual intervention. We do not represent any official government body; our tool is designed solely to provide student-friendly performance estimates and insights.
        </p>

        <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
          Thank you for choosing CBT RANK to track your preparation journey.
        </p>

      </div>
    </div>
  );
}
