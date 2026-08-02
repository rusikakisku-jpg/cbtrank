'use client';
export const runtime = 'edge';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    site_title: 'CBT RANK - Latest Answer Keys & Rank Predictor',
    site_description: 'Select your exam to check marks, shift rank, score normalization, and category cutoffs.',
    telegram_url: 'https://t.me/cbtrank',
    contact_email: 'contact.cbtrank@gmail.com',
    adsense_active: true,
  });

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-2xl">
        <h2 className="text-xl font-extrabold text-white border-b border-white/10 pb-3">Website Global Settings</h2>
        
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-[#94a3b8] font-bold mb-1">Site Title</label>
            <input 
              type="text" 
              value={settings.site_title} 
              onChange={(e) => setSettings({ ...settings, site_title: e.target.value })} 
              className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-white" 
            />
          </div>

          <div>
            <label className="block text-[#94a3b8] font-bold mb-1">Meta Description</label>
            <textarea 
              rows="3" 
              value={settings.site_description} 
              onChange={(e) => setSettings({ ...settings, site_description: e.target.value })} 
              className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-white" 
            />
          </div>

          <div>
            <label className="block text-[#94a3b8] font-bold mb-1">Telegram Official Channel</label>
            <input 
              type="url" 
              value={settings.telegram_url} 
              onChange={(e) => setSettings({ ...settings, telegram_url: e.target.value })} 
              className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-white" 
            />
          </div>

          <button 
            onClick={() => alert('Settings Saved!')} 
            className="bg-[#6366f1] text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-indigo-600 transition-colors"
          >
            Save Settings &rarr;
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
