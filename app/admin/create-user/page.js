'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

export default function CreateUserPage() {
  const router = useRouter();
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Admin' });

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return alert('Fill name and email');
    alert('User Account Created!');
    router.push('/admin/user-directory');
  };

  return (
    <AdminLayout>
      <div className="space-y-4 max-w-2xl">
        <h2 className="text-xl font-extrabold text-white border-b border-white/10 pb-3">Create New Admin User</h2>
        <form onSubmit={handleAddUser} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#94a3b8] font-bold mb-1">Full Name *</label>
            <input 
              type="text" 
              placeholder="John Doe" 
              value={newUser.name} 
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} 
              className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-white" 
              required 
            />
          </div>
          <div>
            <label className="block text-[#94a3b8] font-bold mb-1">Email Address *</label>
            <input 
              type="email" 
              placeholder="user@cbtrank.com" 
              value={newUser.email} 
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} 
              className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-white" 
              required 
            />
          </div>
          <button type="submit" className="bg-[#6366f1] text-white font-bold text-sm px-6 py-3 rounded-xl">
            Create Account &rarr;
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
