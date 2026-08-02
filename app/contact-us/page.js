'use client';
export const runtime = 'edge';

import { useState } from 'react';

export default function ContactUsPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Query');
  const [message, setMessage] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim()
        })
      });

      const data = await res.json();

      if (data.success) {
        setSuccessMessage(data.message || 'Your message was sent successfully!');
        setName('');
        setEmail('');
        setSubject('General Query');
        setMessage('');
      } else {
        setErrorMessage(data.message || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      console.error('Contact Form Submit Exception:', err);
      setErrorMessage('Network error while submitting. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[98%] max-w-[1100px] mx-auto px-3 sm:px-6 py-8 font-sans antialiased text-slate-900">
      
      {/* MASTER CARD CONTAINER */}
      <div className="bg-white border border-slate-200/90 rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden">
        
        {/* Top Decorative Gradient Accent Bar */}
        <div className="h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>

        {/* Header Banner */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white py-10 px-6 sm:px-10 text-center space-y-3 relative overflow-hidden">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Official Support Portal
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Contact Us
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto font-medium leading-relaxed">
            Have questions, feedback, or need help calculating your exam score? Reach out to us below and our support team will get back to you promptly.
          </p>
        </div>

        {/* Main Body */}
        <div className="p-6 sm:p-10 space-y-8">

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-5 space-y-2 text-center">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center mx-auto text-lg shadow-sm">
                📧
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Direct Email</h3>
              <p className="text-xs text-slate-600 font-semibold select-all">
                contact.cbtrank@gmail.com
              </p>
            </div>

            <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-5 space-y-2 text-center">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center mx-auto text-lg shadow-sm">
                ⏱️
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Response Time</h3>
              <p className="text-xs text-slate-600 font-medium">
                Within 24 - 48 Hours
              </p>
            </div>

            <div className="bg-purple-50/60 border border-purple-100 rounded-2xl p-5 space-y-2 text-center">
              <div className="w-10 h-10 bg-purple-600 text-white rounded-xl flex items-center justify-center mx-auto text-lg shadow-sm">
                🚀
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Exam Help</h3>
              <p className="text-xs text-slate-600 font-medium">
                RRB, SSC, IBPS & State Exams
              </p>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="space-y-5 pt-2">
            
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Send Us a Message
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Please provide accurate details so we can address your inquiry efficiently.
              </p>
            </div>

            {/* Success Banner */}
            {successMessage && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 sm:p-5 rounded-2xl text-xs sm:text-sm font-medium flex items-center gap-3 shadow-sm animate-fade-in">
                <span className="text-xl">✅</span>
                <div>
                  <p className="font-bold text-emerald-900">Message Sent Successfully!</p>
                  <p className="text-emerald-700">{successMessage}</p>
                </div>
              </div>
            )}

            {/* Error Banner */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-4 sm:p-5 rounded-2xl text-xs sm:text-sm font-medium flex items-center gap-3 shadow-sm animate-fade-in">
                <span className="text-xl">⚠️</span>
                <div>
                  <p className="font-bold text-red-900">Submission Error</p>
                  <p className="text-red-700">{errorMessage}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-slate-50/70 border border-slate-200 p-6 sm:p-8 rounded-2xl space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-slate-300 focus:border-blue-600 text-xs sm:text-sm rounded-xl p-3 outline-none text-slate-900 shadow-sm transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
                    Your Email Address <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="email" 
                    required 
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-slate-300 focus:border-blue-600 text-xs sm:text-sm rounded-xl p-3 outline-none text-slate-900 shadow-sm transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
                  Subject / Category <span className="text-red-500">*</span>
                </label>
                <select 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-white border border-slate-300 focus:border-blue-600 text-xs sm:text-sm rounded-xl p-3 outline-none text-slate-900 shadow-sm transition-colors"
                >
                  <option value="General Query">General Query</option>
                  <option value="Exam Scorecard / Answer Key Issue">Exam Scorecard / Answer Key Issue</option>
                  <option value="Bug Report / Website Problem">Bug Report / Website Problem</option>
                  <option value="Business & Sponsorship">Business & Sponsorship</option>
                  <option value="Feedback & Suggestions">Feedback & Suggestions</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
                  Your Message <span className="text-red-500">*</span>
                </label>
                <textarea 
                  rows="5" 
                  required 
                  placeholder="Describe your inquiry or message in detail..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-white border border-slate-300 focus:border-blue-600 text-xs sm:text-sm rounded-xl p-3 outline-none text-slate-900 resize-none shadow-sm transition-colors leading-relaxed"
                ></textarea>
              </div>

              <div className="pt-2 text-center">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 hover:opacity-95 text-white font-bold text-sm sm:text-base px-10 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
                >
                  {loading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message 🚀</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>

          {/* Footer Note */}
          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              🔒 Your privacy is important to us. Submitted information is used strictly to respond to your inquiry.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
