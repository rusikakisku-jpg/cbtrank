'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

export default function AddExamPage() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    exam_type: 'other',
    marks_right: '1.00',
    marks_wrong: '0.00',
    location_type_id: '',
    location_id: '',
    answerkey_login_link: '',
    external_exam_id: '',
    youtube_link: '',
    description: '',
    is_visible: true,
    is_latest: false,
    set_on_top: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) return alert('Exam Title is required!');

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/admin/manage-exams');
        }, 1200);
      } else {
        setErrorMsg(data.error || 'Failed to add exam');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Error connecting to D1 API server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-[1000px] mx-auto space-y-6">
        
        {/* PAGE HEADER */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="text-2xl font-extrabold text-[#f8fafc]">Add New Exam</h2>
          <Link href="/admin/manage-exams" className="text-xs font-semibold text-[#94a3b8] hover:text-white transition-colors">
            &larr; Back to Manage Exams
          </Link>
        </div>

        {/* ALERT SUCCESS */}
        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-[#10b981] p-4 rounded-xl text-sm font-semibold flex items-center gap-2">
            ✨ Exam added and inserted into Cloudflare D1 Database! Redirecting...
          </div>
        )}

        {/* ALERT ERROR */}
        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/20 text-[#ef4444] p-4 rounded-xl text-sm font-semibold">
            ❌ {errorMsg}
          </div>
        )}

        {/* FORM CARD MATCHING EXACT PHP STYLES */}
        <form onSubmit={handleSubmit} className="bg-[#1e293b] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Exam Title */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#94a3b8]">Exam Title *</label>
              <input 
                type="text" 
                placeholder="e.g. SSC CGL 2024" 
                value={formData.title} 
                onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                className="w-full bg-[#0f172a] border border-[#334155] focus:border-[#3b82f6] rounded-xl px-4 py-3 text-sm text-[#f8fafc] focus:outline-none transition-all" 
                required 
              />
            </div>

            {/* Subtitle */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#94a3b8]">Subtitle</label>
              <input 
                type="text" 
                placeholder="e.g. Tier-1 Answer Key" 
                value={formData.subtitle} 
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} 
                className="w-full bg-[#0f172a] border border-[#334155] focus:border-[#3b82f6] rounded-xl px-4 py-3 text-sm text-[#f8fafc] focus:outline-none transition-all" 
              />
            </div>

            {/* Exam Type */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#94a3b8]">Exam Type</label>
              <select 
                value={formData.exam_type} 
                onChange={(e) => setFormData({ ...formData, exam_type: e.target.value })} 
                className="w-full bg-[#0f172a] border border-[#334155] focus:border-[#3b82f6] rounded-xl px-4 py-3 text-sm text-[#f8fafc] focus:outline-none cursor-pointer"
              >
                <option value="central">Central</option>
                <option value="railway">Railway</option>
                <option value="state">State</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Marking Scheme */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#94a3b8]">Marking Scheme (Right / Wrong)</label>
              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="number" 
                  step="0.01" 
                  placeholder="Right (e.g. 1.00)" 
                  value={formData.marks_right} 
                  onChange={(e) => setFormData({ ...formData, marks_right: e.target.value })} 
                  className="w-full bg-[#0f172a] border border-[#334155] focus:border-[#3b82f6] rounded-xl px-4 py-3 text-sm text-[#f8fafc] focus:outline-none" 
                />
                <input 
                  type="number" 
                  step="0.01" 
                  placeholder="Wrong (e.g. 0.25)" 
                  value={formData.marks_wrong} 
                  onChange={(e) => setFormData({ ...formData, marks_wrong: e.target.value })} 
                  className="w-full bg-[#0f172a] border border-[#334155] focus:border-[#3b82f6] rounded-xl px-4 py-3 text-sm text-[#f8fafc] focus:outline-none" 
                />
              </div>
            </div>

            {/* Location Type */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#94a3b8]">Location Type</label>
              <select 
                value={formData.location_type_id} 
                onChange={(e) => setFormData({ ...formData, location_type_id: e.target.value })} 
                className="w-full bg-[#0f172a] border border-[#334155] focus:border-[#3b82f6] rounded-xl px-4 py-3 text-sm text-[#f8fafc] focus:outline-none cursor-pointer"
              >
                <option value="">-- Select Type --</option>
                <option value="1">Railway Zone</option>
                <option value="2">SSC Region</option>
                <option value="3">State Exam Board</option>
              </select>
            </div>

            {/* Location (State/Region) */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#94a3b8]">Location (State/Region)</label>
              <select 
                value={formData.location_id} 
                onChange={(e) => setFormData({ ...formData, location_id: e.target.value })} 
                className="w-full bg-[#0f172a] border border-[#334155] focus:border-[#3b82f6] rounded-xl px-4 py-3 text-sm text-[#f8fafc] focus:outline-none cursor-pointer"
              >
                <option value="">-- Select Location --</option>
                <option value="1">RRB Kolkata Zone</option>
                <option value="2">SSC Northern Region (NR)</option>
                <option value="3">OSSSC Odisha State Exam Board</option>
                <option value="4">RRB Mumbai Zone</option>
              </select>
            </div>

            {/* Answerkey Login Link (Full Width) */}
            <div className="sm:col-span-2 space-y-2">
              <label className="block text-xs font-semibold text-[#94a3b8]">Answerkey Login Link</label>
              <input 
                type="text" 
                placeholder="https://digialm.com/..." 
                value={formData.answerkey_login_link} 
                onChange={(e) => setFormData({ ...formData, answerkey_login_link: e.target.value })} 
                className="w-full bg-[#0f172a] border border-[#334155] focus:border-[#3b82f6] rounded-xl px-4 py-3 text-sm text-[#f8fafc] focus:outline-none" 
              />
            </div>

            {/* External Exam ID */}
            <div className="sm:col-span-2 space-y-2">
              <label className="block text-xs font-semibold text-[#94a3b8]">External Exam ID (API / Reference)</label>
              <input 
                type="text" 
                placeholder="Optional internal ID" 
                value={formData.external_exam_id} 
                onChange={(e) => setFormData({ ...formData, external_exam_id: e.target.value })} 
                className="w-full bg-[#0f172a] border border-[#334155] focus:border-[#3b82f6] rounded-xl px-4 py-3 text-sm text-[#f8fafc] focus:outline-none" 
              />
            </div>

            {/* YouTube Link */}
            <div className="sm:col-span-2 space-y-2">
              <label className="block text-xs font-semibold text-[#94a3b8]">YouTube Link</label>
              <input 
                type="text" 
                placeholder="Discussion or Guide Video URL" 
                value={formData.youtube_link} 
                onChange={(e) => setFormData({ ...formData, youtube_link: e.target.value })} 
                className="w-full bg-[#0f172a] border border-[#334155] focus:border-[#3b82f6] rounded-xl px-4 py-3 text-sm text-[#f8fafc] focus:outline-none" 
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2 space-y-2">
              <label className="block text-xs font-semibold text-[#94a3b8]">Description</label>
              <textarea 
                rows="4" 
                placeholder="Briefly describe the exam..." 
                value={formData.description} 
                onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                className="w-full bg-[#0f172a] border border-[#334155] focus:border-[#3b82f6] rounded-xl px-4 py-3 text-sm text-[#f8fafc] focus:outline-none" 
              />
            </div>

            {/* Visibility & Tags Checkboxes */}
            <div className="sm:col-span-2 space-y-2">
              <label className="block text-xs font-semibold text-[#94a3b8]">Visibility & Tags</label>
              <div className="bg-[#0f172a] border border-[#334155] rounded-xl p-4 flex flex-col sm:flex-row gap-5">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-[#f8fafc]">
                  <input 
                    type="checkbox" 
                    checked={formData.is_visible} 
                    onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })} 
                    className="w-4 h-4 accent-[#3b82f6] cursor-pointer"
                  />
                  Visible on Website
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-sm text-[#f8fafc]">
                  <input 
                    type="checkbox" 
                    checked={formData.is_latest} 
                    onChange={(e) => setFormData({ ...formData, is_latest: e.target.checked })} 
                    className="w-4 h-4 accent-[#3b82f6] cursor-pointer"
                  />
                  Mark as Latest
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-sm text-[#f8fafc]">
                  <input 
                    type="checkbox" 
                    checked={formData.set_on_top} 
                    onChange={(e) => setFormData({ ...formData, set_on_top: e.target.checked })} 
                    className="w-4 h-4 accent-[#3b82f6] cursor-pointer"
                  />
                  Set on Top
                </label>
              </div>
            </div>

          </div>

          {/* ACTION BUTTONS */}
          <div className="pt-4 border-t border-white/10 flex items-center gap-6">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold text-sm px-7 py-3 rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              {loading ? 'Inserting into D1...' : 'Save Exam'}
            </button>
            <Link href="/admin/manage-exams" className="text-sm font-semibold text-[#94a3b8] hover:text-[#f8fafc] transition-colors">
              Cancel
            </Link>
          </div>

        </form>

      </div>
    </AdminLayout>
  );
}
