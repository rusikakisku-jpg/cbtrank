export const runtime = 'edge';

import Link from 'next/link';
import { queryD1, firstD1 } from '@/lib/d1';

export const metadata = {
  title: 'CBT RANK - Latest Answer Keys & Rank Predictor',
  description: 'Select your exam to check marks, shift rank, score normalization, and category cutoffs.',
};

export default async function HomePage() {
  let latestItems = [];
  let latestBlogs = [];
  let showBlogs = false;

  try {
    const blogSetting = await firstD1("SELECT setting_value FROM settings WHERE setting_key = 'show_blogs_section'");
    if (blogSetting && String(blogSetting.setting_value) === '1') {
      showBlogs = true;
    }
  } catch (e) {
    console.error('Error fetching show_blogs_section setting:', e);
  }

  try {
    const examsData = await queryD1('SELECT * FROM exams WHERE is_visible = 1 ORDER BY set_on_top DESC, id DESC');
    if (examsData && examsData.length > 0) {
      latestItems = examsData;
    }
  } catch (e) {
    console.error('Error fetching exams for homepage:', e);
  }

  if (showBlogs) {
    try {
      const blogsData = await queryD1('SELECT * FROM blogs ORDER BY id DESC LIMIT 6');
      if (blogsData && blogsData.length > 0) {
        latestBlogs = blogsData;
      }
    } catch (e) {
      console.error('Error fetching blogs for homepage:', e);
    }

    // Fallback defaults if D1 returns empty
    if (latestBlogs.length === 0) {
      latestBlogs = [
        { id: 101, title: 'RRB NTPC CBT-2 Cutoff Marks & Score Normalization Process Explained', slug: 'rrb-ntpc-cbt2-cutoff-normalization-guide', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80', description: 'Comprehensive guide on how Railways calculates normalized marks across multiple shift CBT exams.', created_at: '01 Aug, 2026' }
      ];
    }
  }

  // Fallback defaults if D1 returns empty
  if (latestItems.length === 0) {
    latestItems = [
      { id: 1, title: 'RRB NTPC CBT-2 Official Answer Key 2026', subtitle: 'Check raw score, shift rank & normalized percentile', slug: 'rrb-ntpc-cbt2', is_latest: 1 },
      { id: 2, title: 'SSC CGL Tier-1 Rank Predictor & Answer Key 2026', subtitle: 'Shift-wise difficulty & category safe cutoff', slug: 'ssc-cgl-tier1', is_latest: 1 },
      { id: 3, title: 'RRB ALP CBT-1 Marks & Rank Calculator', subtitle: 'Zone-wise expected cutoff & answer key link', slug: 'rrb-alp-cbt1', is_latest: 1 }
    ];
  }


  return (
    <div className="w-[95%] max-w-[1200px] mx-auto py-6">
      
      {/* MOBILE ONLY: FULL-WIDTH ANSWERKEY CALCULATOR BUTTON AT THE VERY TOP */}
      <div className="block lg:hidden mb-6">
        <Link 
          href="/answerkey" 
          className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white font-bold text-base py-3.5 px-5 rounded-xl shadow-md flex items-center justify-center gap-2.5 hover:opacity-95 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
          </svg>
          Answerkey Calculator
        </Link>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Column: Latest Answer Keys */}
        <section className="space-y-5">
          <div>
            <h2 className="text-2xl font-extrabold text-[#0f172a] tracking-tight">Latest Answer Keys</h2>
            <p className="text-sm text-[#64748b] mt-1">Select your exam to check marks & rank</p>
          </div>

          {/* Exam List Cards */}
          {latestItems.length > 0 ? (
            <div className="grid gap-3">
              {latestItems.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm hover:border-[#0b69ff] hover:shadow-md transition-all group"
                >
                  <Link href={`/${item.slug}/answerkey`} className="flex items-center justify-between p-4 sm:p-5">
                    <div className="space-y-1">
                      <div className="text-[#0b69ff] font-bold text-base sm:text-lg flex items-center gap-2.5 group-hover:text-blue-700">
                        <span>{item.title}</span>
                        {item.is_latest === 1 && (
                          <span className="bg-red-500 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded animate-pulse">
                            Latest
                          </span>
                        )}
                      </div>
                      {item.subtitle && (
                        <p className="text-xs sm:text-sm text-[#64748b]">{item.subtitle}</p>
                      )}
                    </div>

                    <div className="text-slate-300 group-hover:text-[#0b69ff] group-hover:translate-x-1 transition-all">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-xl p-8 text-center text-[#64748b]">
              <p>अभी कोई updates उपलब्ध नहीं हैं।</p>
            </div>
          )}
        </section>

        {/* Right Column: Desktop Button & Articles */}
        <section className="space-y-6">
          
          {/* DESKTOP ONLY: PROMINENT ANSWERKEY CALCULATOR BUTTON */}
          <div className="hidden lg:block">
            <Link 
              href="/answerkey" 
              className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white font-bold text-lg py-4 px-6 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
              Answerkey Calculator
            </Link>
          </div>

          {/* Sidebar Blogs Card with 100% Fill Fit Images */}
          {showBlogs && (
            <div className="space-y-4">
              <h3 className="text-xl font-extrabold text-[#0f172a] pb-2 border-b-2 border-[#0b69ff] inline-block">
                Latest Updates & Articles
              </h3>

              <div className="grid gap-5">
                {latestBlogs.map((blog) => (
                  <Link 
                    key={blog.id}
                    href={`/${blog.slug}`}
                    className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden hover:border-[#0b69ff] hover:shadow-md transition-all flex flex-col group"
                  >
                    {/* PERFECT FILL FIT CONTAINER */}
                    <div className="w-full h-52 sm:h-60 bg-slate-100 overflow-hidden relative">
                      <img 
                        src={blog.image} 
                        alt={blog.title} 
                        className="w-full h-full object-cover object-center block border-0"
                      />
                    </div>

                    {/* Content Below Image */}
                    <div className="p-5 space-y-2">
                      <h4 className="font-bold text-base sm:text-lg text-[#0f172a] group-hover:text-[#0b69ff] transition-colors leading-snug">
                        {blog.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#64748b] line-clamp-2 leading-relaxed">
                        {blog.description}
                      </p>
                      <span className="text-[11px] text-[#64748b] font-medium block pt-2 border-t border-slate-100">
                        🕒 {blog.created_at}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="text-center pt-2">
                <Link 
                  href="/blogs" 
                  className="inline-block bg-slate-100 hover:bg-[#0b69ff] text-[#0b69ff] hover:text-white font-bold text-xs py-2.5 px-5 rounded-lg transition-all"
                >
                  More Articles &rarr;
                </Link>
              </div>
            </div>
          )}

        </section>

      </div>

    </div>
  );
}
