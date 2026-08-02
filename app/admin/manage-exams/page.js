'use client';
export const runtime = 'edge';

import { useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';

export default function ManageExamsPage() {
  const [examsList] = useState([
    { id: 1, title: 'RRB NTPC CBT-2 Official Answer Key 2026', slug: 'rrb-ntpc-cbt2', category: 'railway', marks_right: 1.0, marks_wrong: 0.33, is_latest: 1 },
    { id: 2, title: 'SSC CGL Tier-1 Rank Predictor & Answer Key 2026', slug: 'ssc-cgl-tier1', category: 'central', marks_right: 1.0, marks_wrong: 0.25, is_latest: 1 },
    { id: 3, title: 'RRB ALP CBT-1 Marks & Rank Calculator', slug: 'rrb-alp-cbt1', category: 'railway', marks_right: 1.0, marks_wrong: 0.33, is_latest: 1 },
    { id: 4, title: 'OSSSC RI, ARI, AMIN, ICDS Supervisor Answer Key 2026', slug: 'osssc-ri-ari-amin-icds-sfs-junior-assistant', category: 'state', marks_right: 1.0, marks_wrong: 0.25, is_latest: 1 }
  ]);

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <h2 className="text-xl font-extrabold text-white">Manage Exams ({examsList.length})</h2>
          <Link href="/admin/add-exam" className="bg-[#6366f1] text-white text-xs font-bold px-4 py-2 rounded-xl">
            + Add Exam
          </Link>
        </div>

        <div className="space-y-3">
          {examsList.map((exam) => (
            <div key={exam.id} className="bg-[#111827] border border-white/10 rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-white">{exam.title}</h3>
                <p className="text-xs text-[#94a3b8]">URL: <code className="text-[#818cf8]">/{exam.slug}/answerkey</code></p>
              </div>

              <div className="flex items-center gap-2">
                <Link href={`/${exam.slug}/answerkey`} target="_blank" className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                  View Page
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
