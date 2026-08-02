export const runtime = 'edge';

export const metadata = {
  title: 'Terms & Conditions - CBT RANK',
  description: 'Official Terms & Conditions for CBT RANK automated rank calculation service.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function TermsAndConditionsPage() {
  return (
    <div className="w-[98%] max-w-[1200px] mx-auto px-2.5 py-6">
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-6 text-slate-700 leading-relaxed text-base max-w-[900px] mx-auto">
        
        <div className="text-center space-y-1">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0b69ff]">
            Terms & Conditions
          </h1>
          <p className="text-xs text-slate-500 font-medium pt-1">
            Last updated: 01 Aug 2026
          </p>
        </div>

        <p className="text-center max-w-xl mx-auto">
          Welcome to <strong>CBT RANK</strong>. By accessing or using our services, you agree to follow the Terms & Conditions listed below.
        </p>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-[#0b69ff]">1. Service Description & Use</h2>
          <p>
            CBT RANK provides an automated rank and score calculation tool for candidates of online government examinations. By submitting your official answer key link or responses, you grant the platform permission to automatically process and analyze the data to compute your scores and place you in our user-based ranking database.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-[#0b69ff]">2. Automated Calculations Disclaimer</h2>
          <p>
            All calculations, including subject-wise marks, count of attempted/unattempted questions, right/wrong question matching, and rank estimation, are completely program-driven and performed automatically by our software algorithms.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-[#0b69ff]">3. Accuracy & Indicative Nature of Ranks</h2>
          <p>
            The ranks and scores calculated by CBT RANK are strictly indicative and based entirely on the pool of users who have voluntarily submitted their answer keys on our website for a given exam.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-[#0b69ff]">4. Contact Us</h2>
          <p>
            For any queries regarding these Terms & Conditions, feel free to contact us:<br />
            <strong>Email:</strong> contact.cbtrank@gmail.com
          </p>
        </section>

      </div>
    </div>
  );
}
