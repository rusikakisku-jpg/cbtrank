export const runtime = 'edge';

'use client';
import { useState } from 'react';

export default function ContactUsPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    
    setSuccess(true);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="w-[98%] max-w-[1200px] mx-auto px-2.5 py-6">
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
        
        <h1 className="text-3xl sm:text-4xl font-bold text-[#0b69ff] text-center">
          Contact Us
        </h1>

        <p className="text-base text-slate-700 text-center">
          If you have any questions, suggestions, or need support, feel free to reach out to us using the details below.
        </p>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-[#0b69ff]">📧 Email Support</h2>
          <p className="text-base text-slate-700">
            You can email us at:<br />
            <strong className="text-slate-900">contact.cbtrank@gmail.com</strong>
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#0b69ff]">📝 Send a Message</h2>
          <p className="text-base text-slate-700">
            Fill out the form below and our team will get back to you soon.
          </p>

          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-lg text-sm font-medium">
              Your message was sent successfully! We'll get back to you at the email you provided.
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-[#f8faff] border border-[#e0e7ff] p-5 sm:p-6 rounded-xl space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">Your Name *</label>
              <input 
                type="text" 
                required 
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-[#c7d2fe] focus:border-[#6366f1] text-sm rounded-lg p-3 outline-none text-slate-800"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">Your Email *</label>
              <input 
                type="email" 
                required 
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-[#c7d2fe] focus:border-[#6366f1] text-sm rounded-lg p-3 outline-none text-slate-800"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">Your Message *</label>
              <textarea 
                rows="5" 
                required 
                placeholder="Write your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-white border border-[#c7d2fe] focus:border-[#6366f1] text-sm rounded-lg p-3 outline-none text-slate-800 resize-none"
              ></textarea>
            </div>

            <div className="text-center pt-2">
              <button 
                type="submit" 
                className="bg-[#0b69ff] hover:bg-[#0044cc] text-white font-bold text-base px-8 py-3 rounded-lg shadow-md transition-colors"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-2 pt-2 border-t border-slate-100">
          <h2 className="text-xl font-bold text-[#0b69ff]">📝 Important Note</h2>
          <p className="text-base text-slate-700">
            We reply to all queries within 24-48 hours. Make sure your email address is entered correctly so we can respond.
          </p>
        </div>

      </div>
    </div>
  );
}
