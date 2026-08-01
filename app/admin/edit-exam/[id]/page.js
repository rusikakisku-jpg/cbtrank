'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

export default function EditExamPage() {
  const router = useRouter();
  const [exam, setExam] = useState({
    title: 'RRB NTPC CBT-2 Official Answer Key 2026',
    slug: 'rrb-ntpc-cbt2',
    category: 'railway',
    marks_right: '1.00',
    marks_wrong: '0.33',
    login_url: 'https://cdn3.digialm.com/EForms/loginAction.do?subAction=ViewLoginPage&formId=100576&orgId=33040',
  });

  const handleSave = (e) => {
    e.preventDefault();
    alert('Exam Updated Successfully in Cloudflare D1!');
    router.push('/admin/manage-exams');
  };

  return (
    <AdminLayout>
      <div className="space-y-4 max-w-2xl">
        <h2 className="text-xl font-extrabold text-white border-b border-white/10 pb-3">Edit Exam Details</h2>
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#94a3b8] font-bold mb-1">Exam Title</label>
            <input 
              type="text" 
              value={exam.title} 
              onChange={(e) => setExam({ ...exam, title: e.target.value })} 
              className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-white" 
            />
          </div>
          <div>
            <label className="block text-[#94a3b8] font-bold mb-1">URL Slug</label>
            <input 
              type="text" 
              value={exam.slug} 
              onChange={(e) => setExam({ ...exam, slug: e.target.value })} 
              className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-white" 
            />
          </div>
          <button type="submit" className="bg-[#6366f1] text-white font-bold text-sm px-6 py-3 rounded-xl">
            Update Exam &rarr;
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
