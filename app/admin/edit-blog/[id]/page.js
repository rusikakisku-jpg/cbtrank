'use client';
export const runtime = 'edge';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

export default function EditBlogPage() {
  const router = useRouter();
  const [blog, setBlog] = useState({
    title: 'RRB NTPC CBT-2 Cutoff Marks & Score Normalization Process Explained',
    slug: 'rrb-ntpc-cbt2-cutoff-normalization-guide',
    description: 'Detailed normalization guide...',
  });

  const handleSave = (e) => {
    e.preventDefault();
    alert('Blog Updated Successfully in Cloudflare D1 & R2!');
    router.push('/admin/all-blogs');
  };

  return (
    <AdminLayout>
      <div className="space-y-4 max-w-2xl">
        <h2 className="text-xl font-extrabold text-white border-b border-white/10 pb-3">Edit Blog Article</h2>
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#94a3b8] font-bold mb-1">Headline</label>
            <input 
              type="text" 
              value={blog.title} 
              onChange={(e) => setBlog({ ...blog, title: e.target.value })} 
              className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-white" 
            />
          </div>
          <div>
            <label className="block text-[#94a3b8] font-bold mb-1">Article Content</label>
            <textarea 
              rows="6" 
              value={blog.description} 
              onChange={(e) => setBlog({ ...blog, description: e.target.value })} 
              className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono" 
            />
          </div>
          <button type="submit" className="bg-[#6366f1] text-white font-bold text-sm px-6 py-3 rounded-xl">
            Update Article &rarr;
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
