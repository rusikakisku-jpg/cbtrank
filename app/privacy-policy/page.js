export const metadata = {
  title: 'Privacy Policy - CBT RANK',
  description: 'Official Privacy Policy for CBT RANK covering data collection, automated scoring algorithms, cookies, and Google AdSense policies.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="w-[98%] max-w-[1200px] mx-auto px-2.5 py-6">
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-6 text-slate-700 leading-relaxed text-base">
        
        <div className="text-center space-y-1">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0b69ff]">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-500 font-medium pt-1">
            Last updated: 01 Aug 2026
          </p>
        </div>

        <p>
          Welcome to <strong>CBT RANK</strong>. We respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains what information we collect, why we collect it, how we use and protect it, and the choices you have regarding your data.
        </p>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-[#0b69ff]">1. Information We Collect</h2>
          <p>We collect information you provide directly and data collected automatically when you use our site:</p>
          <ul className="list-disc pl-6 space-y-1.5 text-sm">
            <li><strong>Information you provide:</strong> Name, email address and any message or details you submit through contact forms or support requests.</li>
            <li><strong>Usage information:</strong> Pages visited, time spent on pages, IP address, device and browser information, referral source, and other analytics data.</li>
            <li><strong>Cookies & similar technologies:</strong> Small files stored on your device to improve site functionality and remember preferences.</li>
            <li><strong>Answer key & exam inputs:</strong> When you paste or upload an answer key (your responses) for analysis, we collect the answer data you provide along with any optional metadata you submit (exam name, date, shift, category, or identifiers you choose to include).</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-[#0b69ff]">2. How We Use Your Information</h2>
          <p>We use the collected information for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-1.5 text-sm">
            <li>To respond to your inquiries, support requests, and feedback.</li>
            <li>To provide, maintain and improve our services, content and user experience.</li>
            <li>To analyze site usage and performance for product development and optimization.</li>
            <li>To send occasional updates or important notices related to the services.</li>
            <li><strong>To generate automated exam analysis and scorecards:</strong> When you submit an answer key or exam responses, we process that data to calculate scores, total rank, shift rank, category rank, average marks, and normalized marks.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-[#0b69ff]">3. Answer Key Analysis & Automated Scoring (Important)</h2>
          <p>We offer an automated answer-key analysis and scoring feature that helps users check their exam performance and estimated rank:</p>
          <ul className="list-disc pl-6 space-y-1.5 text-sm">
            <li><strong>What we process:</strong> The official answer key link or responses pasted/uploaded by you, along with optional metadata.</li>
            <li><strong>Purpose:</strong> Our system processes this data to automatically calculate your score, generate a detailed scorecard (including subject-wise marks, attempted, unattempted, correct, and wrong answers count), and estimate your ranking based on other users' submissions.</li>
            <li><strong>100% Automated Processing:</strong> All calculations, scoring, and rank estimations are 100% program-driven and performed automatically by pre-programmed algorithms. There is no manual calculation or human intervention.</li>
            <li><strong>Aggregation & Anonymization:</strong> To compute averages and rankings, individual submissions are aggregated and anonymized. We do not publish or display your individual answers with identifying information.</li>
            <li><strong>Storage:</strong> Submitted answer keys and metadata may be stored temporarily to calculate rankings, averages, and normalization statistics.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-[#0b69ff]">4. Cookies & Tracking</h2>
          <p>We use cookies and similar tracking technologies to operate and improve the website. Cookies help with remembering preferences and understanding how visitors use the site.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-[#0b69ff]">5. Advertising & Analytics (Third-Party Services)</h2>
          <ul className="list-disc pl-6 space-y-1.5 text-sm">
            <li><strong>Google AdSense:</strong> We use Google AdSense to serve ads on our website. Google AdSense uses cookies to serve ads based on a user's prior visits to our website or other websites.</li>
            <li><strong>Google Analytics:</strong> We use Google Analytics to monitor and analyze web traffic and user behavior on our platform.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-[#0b69ff]">6. Data Sharing & Security</h2>
          <p>
            We prioritize your privacy and data security. <strong>We do not sell, rent, trade, or share your personal information or submitted answer keys with any third parties under any circumstances.</strong> All data is kept strictly secure and used solely for the automated calculations on our website.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-[#0b69ff]">7. Contact Us</h2>
          <p>
            If you have questions, requests, or concerns about this Privacy Policy, please contact us at:<br />
            <strong>Email:</strong> contact.cbtrank@gmail.com
          </p>
        </section>

        <p className="text-xs text-slate-500 pt-4 border-t border-slate-100">
          By using CBT RANK and submitting answer keys for analysis you acknowledge that you have read and understood this Privacy Policy and consent to the described processing of your submissions.
        </p>

      </div>
    </div>
  );
}
