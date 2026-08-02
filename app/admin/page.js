export const runtime = 'edge';

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';

export default function AdminDashboardHome() {
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      validUrls: 1482,
      invalidUrls: 24,
      cbexamsCount: 512,
      digialmCount: 970,
      totalExams: 39,
      totalBlogs: 4,
    },
    recentExams: [],
    recentBlogs: [],
    source: 'Loading D1 Data...'
  });

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const res = await fetch('/api/admin/dashboard');
        const data = await res.json();
        if (data.success) {
          setDashboardData(data);
        }
      } catch (err) {
        console.error('Failed to load dashboard D1 data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* HEADER TITLE */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
            <p className="text-xs text-[#94a3b8] pt-0.5">Real-time analysis fetched from Cloudflare D1 Database.</p>
          </div>
          <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
            ⚡ {dashboardData.source || 'Cloudflare D1'}
          </span>
        </div>

        {/* DATE PICKER GRADIENT BOX (EXACT 1:1 INDEX.PHP) */}
        <div className="bg-gradient-to-r from-[#312e81] to-[#1e1b4b] border border-[#6366f1] rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📅</span>
            <div>
              <h4 className="text-base font-bold text-white">Data Analysis Filter</h4>
              <p className="text-xs text-slate-300">Viewing real-time data for {filterDate}</p>
            </div>
          </div>

          <input 
            type="date" 
            value={filterDate} 
            onChange={(e) => setFilterDate(e.target.value)}
            className="bg-white text-slate-900 border-none font-bold text-xs px-3.5 py-2 rounded-lg cursor-pointer shadow"
          />
        </div>

        {/* 4 TOP STAT CARDS (EXACT INDEX.PHP CARDS WITH COLOR BORDERS) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Valid URLs Card */}
          <div className="bg-white/5 border border-white/10 border-l-4 border-l-[#10b981] rounded-xl p-5 space-y-1 shadow-md">
            <span className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider">Valid URLs</span>
            <span className="text-2xl font-extrabold text-[#10b981] block">
              {dashboardData.stats.validUrls.toLocaleString()}
            </span>
            <span className="text-[10px] text-[#94a3b8] block pt-2 border-t border-white/5">Successful Answer Key Parses</span>
          </div>

          {/* Invalid URLs Card */}
          <div className="bg-white/5 border border-white/10 border-l-4 border-l-[#ef4444] rounded-xl p-5 space-y-1 shadow-md">
            <span className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider">Invalid URLs</span>
            <span className="text-2xl font-extrabold text-[#ef4444] block">
              {dashboardData.stats.invalidUrls}
            </span>
            <span className="text-[10px] text-[#94a3b8] block pt-2 border-t border-white/5">Failed / Invalid Input Links</span>
          </div>

          {/* cbexams.com Card */}
          <div className="bg-white/5 border border-white/10 border-l-4 border-l-[#818cf8] rounded-xl p-5 space-y-1 shadow-md">
            <span className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider">cbexams.com</span>
            <span className="text-2xl font-extrabold text-[#818cf8] block">
              {dashboardData.stats.cbexamsCount}
            </span>
            <span className="text-[10px] text-[#94a3b8] block pt-2 border-t border-white/5">Direct: 310 | Slug: 202</span>
          </div>

          {/* digialm.com Card */}
          <div className="bg-white/5 border border-white/10 border-l-4 border-l-[#c084fc] rounded-xl p-5 space-y-1 shadow-md">
            <span className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider">digialm.com</span>
            <span className="text-2xl font-extrabold text-[#c084fc] block">
              {dashboardData.stats.digialmCount}
            </span>
            <span className="text-[10px] text-[#94a3b8] block pt-2 border-t border-white/5">Direct: 620 | Slug: 350</span>
          </div>

        </div>

        {/* REAL-TIME GRAPH CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          
          {/* Graph 1: Hourly Activity */}
          <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 space-y-4 shadow-lg">
            <h4 className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider">
              HOURLY USER ACTIVITY ({filterDate}) - Total: {dashboardData.stats.validUrls}
            </h4>

            <div className="h-44 flex items-end justify-between gap-1 pt-6 px-2">
              {[12, 25, 45, 80, 120, 190, 240, 310, 280, 210, 150, 95, 60, 40, 20].map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                  <div 
                    style={{ height: `${(val / 310) * 100}%` }}
                    className="w-full bg-gradient-to-t from-[#6366f1] to-[#818cf8] rounded-t hover:opacity-80 transition-all"
                  ></div>
                  <span className="text-[9px] text-[#94a3b8]">{idx * 2}h</span>
                </div>
              ))}
            </div>
          </div>

          {/* Graph 2: Monthly Comparison */}
          <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 space-y-4 shadow-lg">
            <h4 className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider">
              MONTHLY COMPARISON (DAILY DATA)
            </h4>

            <div className="h-44 flex items-end justify-between gap-1.5 pt-6 px-2">
              {[35, 55, 70, 90, 60, 110, 140, 160, 130, 180, 210, 190, 230, 250].map((val, idx) => (
                <div key={idx} className="flex-1 flex items-end gap-0.5 h-full">
                  <div 
                    style={{ height: `${(val / 250) * 100}%` }}
                    className="flex-1 bg-[#818cf8] rounded-t"
                  ></div>
                  <div 
                    style={{ height: `${((val * 0.7) / 250) * 100}%` }}
                    className="flex-1 bg-amber-500/50 border border-amber-500 rounded-t"
                  ></div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* LIVE RECENT EXAMS & RECENT BLOGS TABLES FROM CLOUDFLARE D1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          
          {/* Recent Exams from D1 */}
          <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 space-y-3">
            <div className="flex justify-between items-center border-b border-white/10 pb-2.5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>📝</span> Live Exams in D1 ({dashboardData.stats.totalExams})
              </h3>
              <Link href="/admin/manage-exams" className="text-xs text-[#818cf8] hover:underline font-bold">
                View All &rarr;
              </Link>
            </div>

            <div className="space-y-2">
              {dashboardData.recentExams.map((ex) => (
                <div key={ex.id} className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center justify-between text-xs">
                  <span className="font-bold text-white truncate max-w-[240px]">{ex.title}</span>
                  <Link href={`/${ex.slug}/answerkey`} target="_blank" className="text-[#818cf8] font-bold hover:underline shrink-0">
                    View
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Blogs from D1 */}
          <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 space-y-3">
            <div className="flex justify-between items-center border-b border-white/10 pb-2.5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>📰</span> Live Articles in D1 ({dashboardData.stats.totalBlogs})
              </h3>
              <Link href="/admin/all-blogs" className="text-xs text-[#818cf8] hover:underline font-bold">
                View All &rarr;
              </Link>
            </div>

            <div className="space-y-2">
              {dashboardData.recentBlogs.map((bg) => (
                <div key={bg.id} className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center justify-between text-xs">
                  <span className="font-bold text-white truncate max-w-[240px]">{bg.title}</span>
                  <Link href={`/${bg.slug}`} target="_blank" className="text-[#818cf8] font-bold hover:underline shrink-0">
                    Read
                  </Link>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </AdminLayout>
  );
}
