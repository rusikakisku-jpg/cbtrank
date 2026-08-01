export const metadata = {
  title: 'Disclaimer - CBT RANK',
  description: 'Official Disclaimer for CBT RANK regarding automated calculation accuracy and independence from official exam authorities.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function DisclaimerPage() {
  return (
    <div className="w-[98%] max-w-[1200px] mx-auto px-2.5 py-6">
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-6 text-slate-700 leading-relaxed text-base">
        
        <div className="text-center space-y-1">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0b69ff]">
            Disclaimer
          </h1>
          <p className="text-xs text-slate-500 font-medium pt-1">
            Last updated: 01 Aug 2026
          </p>
        </div>

        <p className="text-center max-w-2xl mx-auto">
          The information provided on <strong>CBT RANK</strong> is published in good faith and is intended purely for educational and informational purposes. While we strive to maintain accuracy, reliability, and clarity, we make no guarantees regarding the completeness or accuracy of any information displayed on this website.
        </p>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-[#0b69ff]">1. No Official Affiliation</h2>
          <p>
            CBT RANK is a completely independent utility platform and is not officially linked to, affiliated with, or endorsed by any government department, exam authority, board, or ministry. All calculations, ranks, and estimations are generated automatically by our platform using user-submitted data.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-[#0b69ff]">2. Automated Calculations Disclaimer</h2>
          <p>
            The calculators and tools available on CBT RANK are 100% program-driven and performed automatically by software algorithms. Subject-wise marks, count of attempted, unattempted, correct, and wrong answers, and overall marks are processed without any manual intervention or calculation by our team. Ranks are computed relative to other candidates who have voluntarily submitted their answer keys on this platform.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-[#0b69ff]">3. Accuracy & Indicative Ranks</h2>
          <p>
            Any scorecards, rankings, averages, or normalization estimates shown on CBT RANK are indicative and meant strictly for educational and guidance purposes. They do not constitute official results, final scorecards, or verified rankings. The official exam conducting authorities are the sole authority for releasing final results and rankings. Users must rely on official notifications for actual results.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-[#0b69ff]">4. External Links Disclaimer</h2>
          <p>
            This website may include links to third-party portals or external websites for references. These sites are not operated or controlled by CBT RANK. We do not guarantee the security, availability, or accuracy of any information on external sites, and access to them is at the user's own discretion.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-[#0b69ff]">5. Limitation of Liability</h2>
          <p>
            CBT RANK shall not be held liable for any direct, indirect, incidental, or consequential loss, discrepancy, or damage arising from reliance on automated calculations, ranks, server downtime, or discrepancies between software-calculated scores and official results.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-[#0b69ff]">6. Consent & Contact</h2>
          <p>
            By using our website, you agree to our Disclaimer and fully accept its terms. If you have any questions regarding this Disclaimer, feel free to contact us:<br />
            <strong>Email:</strong> contact.cbtrank@gmail.com
          </p>
        </section>

      </div>
    </div>
  );
}
