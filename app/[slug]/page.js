import Link from 'next/link';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const formattedTitle = slug
    ? slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
    : 'Article Details';

  return {
    title: `${formattedTitle} - CBT RANK`,
    description: `Read complete insights and updates on ${formattedTitle} on CBT RANK.`,
    openGraph: {
      title: `${formattedTitle} - CBT RANK`,
      description: `Detailed analysis and guide for ${formattedTitle}.`,
      type: 'article',
    },
  };
}

export default async function DynamicArticlePage({ params }) {
  const { slug } = await params;

  // Mock post database mapping
  const postsDatabase = {
    'ssc-cgl-tier1-safe-marks-category-wise': {
      title: 'SSC CGL Tier-1 Safe Marks for General, OBC, EWS & SC/ST Categories',
      date: 'Jul 31, 2026',
      author: 'Admin',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
      category: 'SSC CGL',
      tags: ['SSC CGL', 'Tier 1', 'Cutoff Marks', 'Normalization'],
      content: `
        <p class="text-base text-slate-700 leading-relaxed">
          Staff Selection Commission (SSC) conducted the Combined Graduate Level (CGL) Tier-1 examination across multiple shifts. Candidates across the country are analyzing shift difficulty to determine safe qualifying cutoffs for Tier-2 qualification.
        </p>

        <h3 class="text-xl font-bold text-[#0b69ff] pt-4 pb-2 border-b border-slate-100">Category-Wise Expected Safe Raw Marks</h3>
        <ul class="list-disc pl-6 space-y-2 text-[#334155] text-base">
          <li><strong>UR / Unreserved:</strong> 132 - 138 Raw Marks</li>
          <li><strong>OBC:</strong> 126 - 132 Raw Marks</li>
          <li><strong>EWS:</strong> 122 - 128 Raw Marks</li>
          <li><strong>SC:</strong> 108 - 114 Raw Marks</li>
          <li><strong>ST:</strong> 98 - 104 Raw Marks</li>
        </ul>

        <h3 class="text-xl font-bold text-[#0b69ff] pt-4 pb-2 border-b border-slate-100">Score Normalization Impact</h3>
        <p class="text-base text-slate-700 leading-relaxed">
          Harder shifts will receive raw mark boosts ranging between +8 to +14 marks based on candidate score variance. Candidates scoring near borderline marks in hard shifts have strong chances of clearing the Tier-1 cutoff post normalization.
        </p>
      `,
    },
    'rrb-ntpc-cbt2-cutoff-normalization-guide': {
      title: 'RRB NTPC CBT-2 Cutoff Marks & Score Normalization Process Explained',
      date: 'Aug 01, 2026',
      author: 'Admin',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80',
      category: 'Railways RRB',
      tags: ['RRB NTPC', 'CBT 2', 'Normalization', 'Railway Exam'],
      content: `
        <p class="text-base text-slate-700 leading-relaxed">
          Railway Recruitment Boards (RRB) utilize standard deviation normalization across multi-shift Computer Based Tests. This ensures candidate percentile rankings are fair across all difficulty levels.
        </p>

        <h3 class="text-xl font-bold text-[#0b69ff] pt-4 pb-2 border-b border-slate-100">Standard Deviation Formula Breakdown</h3>
        <p class="text-base text-slate-700 leading-relaxed">
          Normalized marks are computed relative to the mean and standard deviation of top 0.1% candidates across all shifts compared against shift-specific performance.
        </p>
      `,
    },
  };

  const popularPosts = [
    { title: 'RRB NTPC CBT-2 Normalization Guide', slug: 'rrb-ntpc-cbt2-cutoff-normalization-guide', date: 'Aug 01, 2026' },
    { title: 'SSC CGL Tier-1 Category Safe Marks', slug: 'ssc-cgl-tier1-safe-marks-category-wise', date: 'Jul 31, 2026' },
    { title: 'CBT Percentile Calculation Formula', slug: 'how-to-calculate-cbt-percentile-score', date: 'Jul 29, 2026' },
  ];

  const article = postsDatabase[slug] || {
    title: slug
      ? slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
      : 'Exam Article & Updates',
    date: '01 Aug, 2026',
    author: 'Admin',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    category: 'Exam Updates',
    tags: ['CBT Exam', 'Updates', 'Scorecard'],
    content: `
      <p class="text-base text-slate-700 leading-relaxed">
        Welcome to CBT RANK article portal. Check comprehensive exam analysis, category cutoffs, answer key calculators, and normalized percentile rankings.
      </p>
    `,
  };

  return (
    <div className="w-[98%] max-w-[1200px] mx-auto px-2.5 py-6">
      
      {/* 1 SINGLE MASTER CONTAINER CARD WITHOUT INNER DIVIDER BORDER */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 sm:p-8 shadow-sm">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT SIDE CONTENT */}
          <article className="lg:col-span-2 space-y-6">
            
            {/* Clean Header: Starts directly with Article Title */}
            <div className="space-y-3">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0f172a] leading-tight">
                {article.title}
              </h1>

              <div className="flex items-center justify-between flex-wrap gap-4 text-xs text-[#64748b] font-medium pt-2 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-4">
                  <span>👤 Author: {article.author}</span>
                  <span>•</span>
                  <span>🕒 Published: {article.date}</span>
                </div>

                {/* Share links */}
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700">Share:</span>
                  <a 
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(article.title)}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="bg-[#128c7e] text-white px-2.5 py-1 rounded text-[11px] font-bold hover:opacity-90"
                  >
                    WhatsApp
                  </a>
                  <a 
                    href="https://t.me/share/url" 
                    target="_blank" 
                    rel="noreferrer"
                    className="bg-[#0088cc] text-white px-2.5 py-1 rounded text-[11px] font-bold hover:opacity-90"
                  >
                    Telegram
                  </a>
                </div>
              </div>
            </div>

            {/* Hero Cover Image */}
            <div className="w-full h-64 sm:h-80 md:h-96 bg-slate-100 rounded-xl overflow-hidden">
              <img 
                src={article.image} 
                alt={article.title} 
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Article HTML Content */}
            <div 
              className="prose prose-slate max-w-none text-slate-700 space-y-4 pt-2"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Call to Action Button */}
            <div className="pt-4 text-center">
              <Link 
                href="/answerkey" 
                className="inline-flex items-center justify-center bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-bold text-base px-8 py-3.5 rounded-xl shadow-lg hover:opacity-95 transition-opacity"
              >
                Check Your Answerkey & Rank Now 🚀
              </Link>
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-700">Tags:</span>
                {article.tags.map((tag, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-600 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-slate-200">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* AdSense In-Article Banner */}
            <div className="bg-slate-100 border border-dashed border-slate-300 rounded-xl p-4 text-center text-xs text-slate-500 mt-6">
              <span>Advertisement (Google AdSense 728x90 In-Article Banner)</span>
            </div>

          </article>

          {/* RIGHT SIDE SIDEBAR WITHOUT DIVIDER BORDER */}
          <aside className="space-y-6">
            
            {/* Search Widget */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-[#0f172a]">Search Articles</h3>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="flex-1 bg-[#f8fafc] border border-slate-300 text-xs text-slate-800 rounded-lg px-3 py-2 focus:outline-none focus:border-[#0b69ff]"
                />
                <button className="bg-[#0b69ff] text-white font-bold text-xs px-4 py-2 rounded-lg hover:bg-blue-700">
                  Search
                </button>
              </div>
            </div>

            {/* Answerkey Calculator CTA Widget */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 text-center">
              <h3 className="text-sm font-bold text-[#0f172a]">Answer Key Calculator</h3>
              <p className="text-[11px] text-slate-500">Calculate marks, shift rank & normalized percentile instantly.</p>
              <Link 
                href="/answerkey" 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-800 text-white font-bold text-xs py-2.5 px-3 rounded-lg shadow block text-center hover:opacity-95"
              >
                Open Calculator 🚀
              </Link>
            </div>

            {/* Popular Posts Widget */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-[#0f172a] border-b border-slate-100 pb-2">Popular Posts</h3>
              <div className="space-y-3">
                {popularPosts.map((pop, idx) => (
                  <div key={idx} className="border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                    <Link href={`/${pop.slug}`} className="text-xs font-bold text-[#0f172a] hover:text-[#0b69ff] leading-snug block">
                      {pop.title}
                    </Link>
                    <span className="text-[11px] text-[#64748b] block pt-0.5">{pop.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter Widget */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-[#0f172a]">Newsletter</h3>
              <p className="text-xs text-[#64748b]">Get latest exam alerts delivered straight to your inbox.</p>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-[#f8fafc] border border-slate-300 text-xs text-slate-800 rounded-lg px-3 py-2 focus:outline-none focus:border-[#0b69ff]"
              />
              <button className="w-full bg-[#0b69ff] text-white font-bold text-xs py-2 rounded-lg hover:bg-blue-700">
                Subscribe
              </button>
            </div>

            {/* AdSense 300x250 Sidebar Widget */}
            <div className="bg-slate-100 border border-dashed border-slate-300 rounded-xl p-5 text-center text-xs text-slate-500">
              <span>Advertisement (AdSense 300x250)</span>
            </div>

          </aside>

        </div>

      </div>

    </div>
  );
}
