'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

export default function AddLocationPage() {
  const router = useRouter();
  const [newLocation, setNewLocation] = useState({ name: '', type: 'Railway Zone' });

  const handleAddLocation = (e) => {
    e.preventDefault();
    if (!newLocation.name) return alert('Fill location name');
    alert('Location Saved!');
    router.push('/admin/manage-locations');
  };

  return (
    <AdminLayout>
      <div className="space-y-4 max-w-2xl">
        <h2 className="text-xl font-extrabold text-white border-b border-white/10 pb-3">Add New Location / Region</h2>
        <form onSubmit={handleAddLocation} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#94a3b8] font-bold mb-1">Region / Zone Name *</label>
            <input 
              type="text" 
              placeholder="e.g. RRB Kolkata Zone" 
              value={newLocation.name} 
              onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })} 
              className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-white" 
              required 
            />
          </div>
          <button type="submit" className="bg-[#6366f1] text-white font-bold text-sm px-6 py-3 rounded-xl">
            Save Location &rarr;
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
