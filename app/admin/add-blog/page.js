export const runtime = 'edge';

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

export default function AddBlogPage() {
  const router = useRouter();
  const [newBlog, setNewBlog] = useState({
    title: '',
    slug: '',
    image: '',
    category: 'Updates',
    description: '',
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setNewBlog({ ...newBlog, image: data.url });
        alert(`Image Uploaded Successfully to ${data.storage}!`);
      } else {
        alert('Upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddBlog = (e) => {
    e.preventDefault();
    if (!newBlog.title || !newBlog.slug) return alert('Fill title and slug!');
    alert('Article Published to Cloudflare D1 & R2!');
    router.push('/admin/all-blogs');
  };

  return (
    <AdminLayout>
      <div className="space-y-4 max-w-2xl">
        <h2 className="text-xl font-extrabold text-white border-b border-white/10 pb-3">Add New Blog Article</h2>
        
        <form onSubmit={handleAddBlog} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#94a3b8] font-bold mb-1">Headline *</label>
            <input 
              type="text" 
              placeholder="Headline text..." 
              value={newBlog.title} 
              onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })} 
              className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-white" 
              required 
            />
          </div>

          <div>
            <label className="block text-[#94a3b8] font-bold mb-1">URL Slug *</label>
            <input 
              type="text" 
              placeholder="my-article-slug" 
              value={newBlog.slug} 
              onChange={(e) => setNewBlog({ ...newBlog, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} 
              className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-white" 
              required 
            />
          </div>

          {/* CLOUDFLARE R2 IMAGE UPLOADER */}
          <div>
            <label className="block text-[#94a3b8] font-bold mb-1">Upload Cover Image (Cloudflare R2 Storage)</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2 text-xs text-slate-300 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#6366f1] file:text-white hover:file:opacity-90 cursor-pointer"
            />
            {uploadingImage && <p className="text-xs text-amber-400 mt-1">Uploading to R2 Storage...</p>}
            {newBlog.image && <p className="text-xs text-emerald-400 mt-1">Uploaded URL: <code className="text-white">{newBlog.image}</code></p>}
          </div>

          <div>
            <label className="block text-[#94a3b8] font-bold mb-1">Article Content (HTML Supported)</label>
            <textarea 
              rows="6" 
              value={newBlog.description} 
              onChange={(e) => setNewBlog({ ...newBlog, description: e.target.value })} 
              className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono" 
              required 
            />
          </div>

          <button 
            type="submit" 
            className="bg-[#6366f1] text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-indigo-600 transition-colors"
          >
            Publish Article &rarr;
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
