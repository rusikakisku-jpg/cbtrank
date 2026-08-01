import Link from 'next/link';

export const metadata = {
  title: 'Latest Posts & Articles - CBT RANK',
  description: 'Browse all latest exam updates, answer key guides, score normalization methods, and category cutoff articles.',
};

export default function BlogsPage() {
  const posts = [
    {
      id: 1,
      title: 'RRB NTPC CBT-2 Cutoff Marks & Score Normalization Process Explained',
      slug: 'rrb-ntpc-cbt2-cutoff-normalization-guide',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80',
      author: 'Admin',
      created_at: 'Aug 01, 2026',
      description: 'Comprehensive guide on how Railways calculates normalized marks across multiple shift CBT exams. Learn the exact standard deviation formula used by RRBs to compute candidate percentile scores.',
    },
    {
      id: 2,
      title: 'SSC CGL Tier-1 Safe Marks for General, OBC, EWS & SC/ST Categories',
      slug: 'ssc-cgl-tier1-safe-marks-category-wise',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
      author: 'Admin',
      created_at: 'Jul 31, 2026',
      description: 'Analyze shift difficulty levels and expected qualifying cutoff marks for SSC CGL Tier-1. Get category-wise raw score vs normalized score predictions for all 2026 exam shifts.',
    },
    {
      id: 3,
      title: 'How to Calculate Your Percentile Score in Computer Based Tests',
      slug: 'how-to-calculate-cbt-percentile-score',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
      author: 'Admin',
      created_at: 'Jul 29, 2026',
      description: 'Step by step formula breakdown for percentile rank calculations in CBT competitive exams. Understand how your shift rank impacts your overall All-India merit listing.',
    },
  ];

  const popularPosts = [
    { title: 'RRB NTPC CBT-2 Normalization Guide', slug: 'rrb-ntpc-cbt2-cutoff-normalization-guide', date: 'Aug 01, 2026' },
    { title: 'SSC CGL Tier-1 Category Safe Marks', slug: 'ssc-cgl-tier1-safe-marks-category-wise', date: 'Jul 31, 2026' },
    { title: 'CBT Percentile Calculation Formula', slug: 'how-to-calculate-cbt-percentile-score', date: 'Jul 29, 2026' },
  ];

  return (
    <div className="w-[95%] max-w-[1200px] mx-auto py-6">
      
      {/* Blog Layout: Vertical Feed + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Main Content: Vertical Articles List */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="border-b-2 border-[#0b69ff] pb-2">
            <h1 className="text-2xl font-extrabold text-[#0f172a]">Latest Posts</h1>
          </div>

          {/* Vertical Feed List */}
          <div className="space-y-8">
            {posts.map((post) => (
              <article 
                key={post.id} 
                className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden shadow-sm hover:border-[#0b69ff] hover:shadow-md transition-all flex flex-col group"
              >
                {/* Static Cover Image */}
                <div className="w-full h-64 sm:h-80 md:h-96 bg-slate-100 overflow-hidden relative">
                  <Link href={`/${post.slug}`}>
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover object-center"
                    />
                  </Link>
                </div>

                {/* Content Below Image */}
                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#0f172a] hover:text-[#0b69ff] transition-colors leading-snug">
                      <Link href={`/${post.slug}`}>{post.title}</Link>
                    </h2>
                    
                    <div className="flex items-center gap-4 text-xs text-[#64748b] font-medium pt-0.5">
                      <span>👤 {post.author}</span>
                      <span>📅 {post.created_at}</span>
                    </div>

                    <p className="text-sm text-[#475569] leading-relaxed pt-2">
                      {post.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <Link 
                      href={`/${post.slug}`} 
                      className="text-xs sm:text-sm font-bold text-[#0b69ff] hover:underline inline-flex items-center gap-1"
                    >
                      Read More &rarr;
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* AdSense Banner */}
          <div className="bg-slate-100 border border-dashed border-slate-300 rounded-xl p-4 text-center text-xs text-slate-500">
            <span>Advertisement (AdSense 728x90 Container)</span>
          </div>

        </div>

        {/* Sidebar Widgets */}
        <aside className="space-y-6">
          
          {/* Search Widget */}
          <div className="bg-white border border-[#e2e8f0] p-5 rounded-xl space-y-3 shadow-sm">
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

          {/* Popular Posts Widget */}
          <div className="bg-white border border-[#e2e8f0] p-5 rounded-xl space-y-4 shadow-sm">
            <h3 className="text-base font-bold text-[#0f172a] border-b border-slate-100 pb-2">Popular Posts</h3>
            <div className="space-y-3">
              {popularPosts.map((pop, idx) => (
                <div key={idx} className="border-b border-slate-50 pb-2.5 last:border-0 last:pb-0">
                  <Link href={`/${pop.slug}`} className="text-xs font-bold text-[#0f172a] hover:text-[#0b69ff] leading-snug block">
                    {pop.title}
                  </Link>
                  <span className="text-[11px] text-[#64748b] block pt-0.5">{pop.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter Widget */}
          <div className="bg-white border border-[#e2e8f0] p-5 rounded-xl space-y-3 shadow-sm">
            <h3 className="text-base font-bold text-[#0f172a]">Newsletter</h3>
            <p className="text-xs text-[#64748b]">Get latest exam alerts delivered straight to your inbox.</p>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="w-full bg-[#f8fafc] border border-slate-300 text-xs text-slate-800 rounded-lg px-3 py-2 focus:outline-none focus:border-[#0b69ff]"
            />
            <button className="w-full bg-[#0b69ff] text-white font-bold text-xs py-2.5 rounded-lg hover:bg-blue-700">
              Subscribe
            </button>
          </div>

          {/* AdSense 300x250 Widget */}
          <div className="bg-slate-100 border border-dashed border-slate-300 rounded-xl p-6 text-center text-xs text-slate-500">
            <span>Advertisement (AdSense 300x250)</span>
          </div>

        </aside>

      </div>

    </div>
  );
}
