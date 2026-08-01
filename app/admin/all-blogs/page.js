'use client';

import { useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';

export default function AllBlogsPage() {
  const [blogsList] = useState([
    { id: 1, title: 'RRB NTPC CBT-2 Cutoff Marks & Score Normalization Process Explained', slug: 'rrb-ntpc-cbt2-cutoff-normalization-guide', category: 'Railways RRB', status: 'publish' },
    { id: 2, title: 'SSC CGL Tier-1 Safe Marks for General, OBC, EWS & SC/ST Categories', slug: 'ssc-cgl-tier1-safe-marks-category-wise', category: 'SSC CGL', status: 'publish' },
  ]);

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <h2 className="text-xl font-extrabold text-white">All Published Articles ({blogsList.length})</h2>
          <Link href="/admin/add-blog" className="bg-[#6366f1] text-white text-xs font-bold px-4 py-2 rounded-xl">
            + Add Blog
          </Link>
        </div>

        <div className="space-y-3">
          {blogsList.map((blog) => (
            <div key={blog.id} className="bg-[#111827] border border-white/10 rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-white">{blog.title}</h3>
                <p className="text-xs text-[#94a3b8]">URL: <code className="text-[#818cf8]">/{blog.slug}</code></p>
              </div>

              <div className="flex items-center gap-2">
                <Link href={`/${blog.slug}`} target="_blank" className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                  View Article
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
