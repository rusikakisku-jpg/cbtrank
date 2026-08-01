'use client';

import { useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';

export default function ManageLocationsPage() {
  const [locationList] = useState([
    { id: 1, name: 'RRB Kolkata Zone', type: 'Railway Zone' },
    { id: 2, name: 'SSC Northern Region (NR)', type: 'SSC Region' },
    { id: 3, name: 'RRB Mumbai Zone', type: 'Railway Zone' },
    { id: 4, name: 'OSSSC Odisha State Exam Board', type: 'State Board' }
  ]);

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <h2 className="text-xl font-extrabold text-white">All Exam Locations ({locationList.length})</h2>
          <Link href="/admin/add-location" className="bg-[#6366f1] text-white text-xs font-bold px-4 py-2 rounded-xl">
            + New Location
          </Link>
        </div>

        <div className="space-y-3">
          {locationList.map((loc) => (
            <div key={loc.id} className="bg-[#111827] border border-white/10 rounded-xl p-4 flex items-center justify-between text-xs">
              <span className="font-bold text-white text-sm">{loc.name}</span>
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-lg font-bold">
                {loc.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
