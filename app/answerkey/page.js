'use client';
export const runtime = 'edge';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AnswerKeyCalculatorPage({ params, initialExam = null }) {
  const router = useRouter();
  const slug = params?.slug || '';
  
  const [ansKeyUrl, setAnsKeyUrl] = useState('');
  const [category, setCategory] = useState('');
  const [horizontalCategory, setHorizontalCategory] = useState('none');
  const [gender, setGender] = useState('');
  const [paperLanguage, setPaperLanguage] = useState('');
  const [state, setState] = useState('');
  
  const [currentExam, setCurrentExam] = useState(initialExam || null);

  // Custom right and wrong marks (defaults)
  const [marksRight, setMarksRight] = useState(
    initialExam?.marks_right !== undefined && initialExam?.marks_right !== null
      ? String(initialExam.marks_right)
      : '1'
  );
  const [marksWrong, setMarksWrong] = useState(
    initialExam?.marks_wrong !== undefined && initialExam?.marks_wrong !== null
      ? String(initialExam.marks_wrong)
      : '0.25'
  );

  const [consentChecked, setConsentChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (slug && (!currentExam || currentExam.slug !== slug)) {
      fetch(`/api/admin/exams`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.exams) {
            const found = data.exams.find(e => e.slug === slug);
            if (found) {
              setCurrentExam(found);
              if (found.marks_right !== undefined && found.marks_right !== null) {
                setMarksRight(String(found.marks_right));
              }
              if (found.marks_wrong !== undefined && found.marks_wrong !== null) {
                setMarksWrong(String(found.marks_wrong));
              }
            }
          }
        })
        .catch(err => console.error(err));
    }
  }, [slug]);

  const examTitleText = currentExam?.title || '';
  const examLabel = examTitleText ? `${examTitleText} ` : '';
  const showState = !currentExam;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ansKeyUrl.trim() || !category || !gender || !consentChecked) {
      setErrorMessage('Please fill all required fields and accept the consent checkbox.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    const formData = {
      ans_key_url: ansKeyUrl.trim(),
      category,
      horizontal_category: horizontalCategory,
      gender,
      state,
      paper_language: paperLanguage,
      marks_right: marksRight,
      marks_wrong: marksWrong,
      slug,
    };

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('cbtrank_form_data', JSON.stringify(formData));
    }

    const queryParams = new URLSearchParams({
      ans_key_url: ansKeyUrl.trim(),
      category,
      horizontal_category: horizontalCategory,
      gender,
      state,
      paper_language: paperLanguage,
      marks_right: marksRight,
      marks_wrong: marksWrong,
      slug
    }).toString();

    router.push(`/result?${queryParams}`);
  };

  const statesList = [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa",
    "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
    "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
    "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
    "Uttar Pradesh","Uttarakhand","West Bengal",
    "Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli and Daman and Diu",
    "Delhi","Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry"
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50/70 pt-1.5 sm:pt-3 pb-16 px-4 sm:px-6 lg:px-8 font-sans antialiased text-slate-900">
      <div className="max-w-6xl mx-auto space-y-7">
        
        {/* CALCULATOR CARD CONTAINER */}
        <div className="w-full max-w-2xl mx-auto bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden transition-all duration-300">
          
          {/* Top Decorative Gradient Accent Bar */}
          <div className="h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>

          {/* Header Banner */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white py-4 px-6 text-center space-y-1.5 relative overflow-hidden">
            <div className="inline-flex items-center gap-1.5 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[11px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              CBT Answer Key Calculator
            </div>

            <h1 className="text-base sm:text-lg font-bold tracking-tight text-white leading-snug max-w-xl mx-auto">
              {examTitleText ? `${examTitleText}` : 'Answer Key Calculator'}
            </h1>

            <p className="text-xs text-slate-300 max-w-md mx-auto font-medium">
              Paste your {examLabel}official answer key URL and add your exam details.
            </p>
          </div>

          <div className="p-5 sm:p-7 space-y-4">

            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-xl font-medium flex items-center gap-2 shadow-sm">
                <span>⚠️</span>
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {/* Answer Key URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Answer Key URL <span className="text-red-500">*</span>
                </label>
                <input 
                  type="url" 
                  required
                  value={ansKeyUrl}
                  onChange={(e) => setAnsKeyUrl(e.target.value)}
                  className="w-full bg-slate-50/80 border border-slate-300/80 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white shadow-sm font-mono"
                />
                <p className="text-[11px] text-slate-500 mt-1 font-medium">
                  Use the official {examLabel}answer key link (the page where questions are visible).
                </p>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs sm:text-sm">
                
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select 
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50/80 border border-slate-300/80 rounded-xl py-2.5 px-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white shadow-sm"
                  >
                    <option value="">Select Category</option>
                    <option value="UR">UR / General</option>
                    <option value="OBC">OBC</option>
                    <option value="EWS">EWS</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Horizontal Category
                  </label>
                  <select 
                    value={horizontalCategory}
                    onChange={(e) => setHorizontalCategory(e.target.value)}
                    className="w-full bg-slate-50/80 border border-slate-300/80 rounded-xl py-2.5 px-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white shadow-sm"
                  >
                    <option value="none">None</option>
                    <option value="exsm">EX SM (Ex-Serviceman)</option>
                    <option value="oh">OH (Orthopedically Handicapped)</option>
                    <option value="vh">VH (Visually Handicapped)</option>
                    <option value="hh">HH (Hearing Handicapped)</option>
                    <option value="other-pwd">Other PWD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select 
                    required
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-slate-50/80 border border-slate-300/80 rounded-xl py-2.5 px-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white shadow-sm"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                {showState ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      State / UT <span className="text-red-500">*</span>
                    </label>
                    <select 
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-slate-50/80 border border-slate-300/80 rounded-xl py-2.5 px-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white shadow-sm"
                    >
                      <option value="">Select State / UT</option>
                      {statesList.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Paper Language
                    </label>
                    <select 
                      value={paperLanguage}
                      onChange={(e) => setPaperLanguage(e.target.value)}
                      className="w-full bg-slate-50/80 border border-slate-300/80 rounded-xl py-2.5 px-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white shadow-sm"
                    >
                      <option value="">Select Language (Optional)</option>
                      <option value="english">English</option>
                      <option value="hindi">Hindi</option>
                      <option value="bengali">Bengali</option>
                      <option value="gujarati">Gujarati</option>
                      <option value="marathi">Marathi</option>
                    </select>
                  </div>
                )}

              </div>

              {/* Consent Checkbox */}
              <div className="pt-1 px-0.5">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-xs text-slate-700 font-medium">
                    Your submitted data will only be used to calculate your marks &amp; rank.
                  </span>
                </label>
              </div>

              {/* Submit Button (Centered & Compact Width) */}
              <div className="pt-1.5 flex justify-center">
                <button 
                  type="submit"
                  disabled={!consentChecked || loading}
                  className={`w-full sm:w-auto px-8 sm:px-12 py-2.5 sm:py-3 rounded-xl font-bold text-white text-xs sm:text-sm tracking-wide shadow-md transition-all duration-200 flex items-center justify-center gap-2 ${
                    consentChecked && !loading 
                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.99] cursor-pointer' 
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Calculating Marks &amp; Rank...
                    </span>
                  ) : (
                    'Calculate Marks & Rank'
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>

        {/* FULL WIDTH MAXIMUM DETAILS SECTION BELOW CALCULATOR */}
        <div className="w-full space-y-6">
          
          {/* Detail Box: Login Link + How to Check Steps */}
          <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-sm space-y-4 text-slate-800 text-xs sm:text-sm">
            
            {currentExam?.answerkey_login_link && (
              <div className="border-b border-slate-100 pb-3">
                <div className="font-extrabold text-slate-900 text-xs sm:text-sm">
                  {examTitleText ? `"${examTitleText}" Answerkey Login Link` : 'Answerkey Login Link'}
                </div>
                <a href={currentExam.answerkey_login_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline block break-all mt-1 font-mono text-xs">
                  {currentExam.answerkey_login_link} ↗
                </a>
              </div>
            )}

            <div>
              <h3 className="font-black text-slate-900 text-sm sm:text-base mb-2 tracking-tight">
                ⭐ How to Check Your {examTitleText ? `"${examTitleText}" ` : ''}Marks &amp; Rank on CBTRank
              </h3>

              <p className="text-xs text-slate-600 mb-3 font-medium">
                You can calculate your {examTitleText ? `"${examTitleText}" ` : ''}marks and check your rank on CBTRank easily by following these steps:
              </p>

              <ul className="list-disc pl-5 space-y-2 text-slate-700 font-medium">
                <li>
                  First, open your {examTitleText ? `"${examTitleText}" ` : ''}exam official answer key and copy its URL.
                </li>
                <li>Visit the CBTRank Score Calculator (this page).</li>
                <li>You will find an input box “Answer Key URL” — paste your copied link here.</li>
                <li>Select your category and horizontal category.</li>
                <li>Choose your paper language (optional).</li>
                <li>Click the Submit button.</li>
              </ul>
            </div>

          </div>

          {/* Full Width Information Section (Maximum Width) */}
          <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-sm space-y-4 text-slate-800 text-xs sm:text-sm">
            <h3 className="font-black text-slate-900 text-sm sm:text-base tracking-tight">
              ⭐ What Information You Will See on CBTRank
            </h3>
            <p className="text-slate-600 font-medium">
              After submitting your details, CBTRank will display a detailed performance report including:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-blue-600">Rank Details</h4>
                <ul className="list-none space-y-1 text-slate-700 font-medium">
                  <li>✔ Overall Rank</li>
                  <li>✔ Shift Rank</li>
                  <li>✔ Category (Vertical) Rank</li>
                </ul>
              </div>

              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-emerald-600">Score Details</h4>
                <ul className="list-none space-y-1 text-slate-700 font-medium">
                  <li>✔ Total Marks</li>
                  <li>✔ Overall Average Marks</li>
                  <li>✔ Shift Average Marks</li>
                  <li>✔ Category Average Marks</li>
                </ul>
              </div>

              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-purple-600">Detailed Scorecard</h4>
                <ul className="list-none space-y-1 text-slate-700 font-medium">
                  <li>✔ Total attempted questions</li>
                  <li>✔ Not attempted questions</li>
                  <li>✔ Right & wrong count</li>
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">⭐ How CBTRank Calculates Ranks</h4>
              <p className="text-slate-600 leading-relaxed font-medium">
                Ranking is calculated using a standard method used in competitive exams.
              </p>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
                <p className="font-bold text-slate-800 mb-1">Example:</p>
                <p>Consider four candidates scoring 10, 50, 50, and 140.</p>
                <p>The candidate scoring 140 gets Rank 1.</p>
                <p>Two candidates scoring 50 will share Rank 2.</p>
                <p>The candidate scoring 10 will get Rank 4 (not Rank 3).</p>
                <p className="mt-1 font-semibold text-slate-800">
                  So, when multiple candidates have the same marks, they receive the same rank, and the next rank is adjusted accordingly.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
