export const runtime = 'edge';

'use client';

import { useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';

export default function UserDirectoryPage() {
  const [userList] = useState([
    { id: 1, name: 'Admin User', email: 'contact.cbtrank@gmail.com', role: 'Super Admin' },
    { id: 2, name: 'Content Editor', email: 'editor@cbtrank.com', role: 'Editor' },
  ]);

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <h2 className="text-xl font-extrabold text-white">User Directory ({userList.length})</h2>
          <Link href="/admin/create-user" className="bg-[#6366f1] text-white text-xs font-bold px-4 py-2 rounded-xl">
            + Create User
          </Link>
        </div>

        <div className="space-y-3">
          {userList.map((usr) => (
            <div key={usr.id} className="bg-[#111827] border border-white/10 rounded-xl p-4 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-white block text-sm">{usr.name}</span>
                <span className="text-[#94a3b8]">{usr.email}</span>
              </div>
              <span className="bg-[#6366f1]/20 text-[#818cf8] border border-[#6366f1]/30 px-3 py-1 rounded-lg font-bold">
                {usr.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
