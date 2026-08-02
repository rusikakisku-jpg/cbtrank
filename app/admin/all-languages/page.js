'use client';
export const runtime = 'edge';

import { useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';

export default function AllLanguagesPage() {
  const [languageList] = useState([
    { id: 1, name: 'English', code: 'en', status: 'Active' },
    { id: 2, name: 'Hindi (हिंदी)', code: 'hi', status: 'Active' },
    { id: 3, name: 'Bengali (বাংলা)', code: 'bn', status: 'Active' },
    { id: 4, name: 'Odia (ଓଡ଼ିଆ)', code: 'or', status: 'Active' }
  ]);

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <h2 className="text-xl font-extrabold text-white">Active Languages ({languageList.length})</h2>
          <Link href="/admin/add-language" className="bg-[#6366f1] text-white text-xs font-bold px-4 py-2 rounded-xl">
            + Add Language
          </Link>
        </div>

        <div className="space-y-3">
          {languageList.map((lang) => (
            <div key={lang.id} className="bg-[#111827] border border-white/10 rounded-xl p-4 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-white block text-sm">{lang.name}</span>
                <span className="text-[#94a3b8]">Code: {lang.code}</span>
              </div>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-lg font-bold">
                {lang.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
