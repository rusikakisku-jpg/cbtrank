'use client';
export const runtime = 'edge';

import { useState } from 'react';

export default function ContactUsPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setLoading(true);
    setSuccess(false);
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: 'General Query',
          message: message.trim()
        })
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setErrorMessage(data.message || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      console.error('Contact Form Error:', err);
      setErrorMessage('Network error while submitting. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[95%] max-w-lg mx-auto py-6 px-3">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">

        <div>
          <h1 className="text-2xl font-bold text-[#0b69ff]">Contact Us</h1>
          <p className="text-sm text-slate-500 mt-1">Email: <strong className="text-slate-700">contact.cbtrank@gmail.com</strong></p>
        </div>

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-lg text-sm font-medium">
            ✅ Message sent successfully! We will get back to you soon.
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg text-sm font-medium">
            ⚠️ {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border border-slate-300 focus:border-[#0b69ff] text-sm rounded-lg p-2.5 outline-none text-slate-800"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-slate-300 focus:border-[#0b69ff] text-sm rounded-lg p-2.5 outline-none text-slate-800"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Message *</label>
            <textarea
              rows="4"
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-white border border-slate-300 focus:border-[#0b69ff] text-sm rounded-lg p-2.5 outline-none text-slate-800 resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0b69ff] hover:bg-[#0044cc] text-white font-bold text-sm py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>

      </div>
    </div>
  );
}
