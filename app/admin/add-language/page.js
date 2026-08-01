'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

export default function AddLanguagePage() {
  const router = useRouter();
  const [newLanguage, setNewLanguage] = useState({ name: '', code: 'en' });

  const handleAddLanguage = (e) => {
    e.preventDefault();
    if (!newLanguage.name) return alert('Fill language name');
    alert('Language Saved!');
    router.push('/admin/all-languages');
  };

  return (
    <AdminLayout>
      <div className="space-y-4 max-w-2xl">
        <h2 className="text-xl font-extrabold text-white border-b border-white/10 pb-3">Add New Language</h2>
        <form onSubmit={handleAddLanguage} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#94a3b8] font-bold mb-1">Language Name *</label>
            <input 
              type="text" 
              placeholder="e.g. Hindi (हिंदी)" 
              value={newLanguage.name} 
              onChange={(e) => setNewLanguage({ ...newLanguage, name: e.target.value })} 
              className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-white" 
              required 
            />
          </div>
          <div>
            <label className="block text-[#94a3b8] font-bold mb-1">Language Code</label>
            <input 
              type="text" 
              placeholder="e.g. hi" 
              value={newLanguage.code} 
              onChange={(e) => setNewLanguage({ ...newLanguage, code: e.target.value })} 
              className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-white" 
            />
          </div>
          <button type="submit" className="bg-[#6366f1] text-white font-bold text-sm px-6 py-3 rounded-xl">
            Save Language &rarr;
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
