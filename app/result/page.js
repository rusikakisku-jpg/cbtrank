'use client';
export const runtime = 'edge';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function ResultPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [downloadingImg, setDownloadingImg] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resultData, setResultData] = useState(null);

  // Editable marks state on result page
  const [customMarksRight, setCustomMarksRight] = useState('');
  const [customMarksWrong, setCustomMarksWrong] = useState('');

  const ansKeyUrl = searchParams.get('ans_key_url') || '';
  const category = searchParams.get('category') || 'UR';
  const horizontalCategory = searchParams.get('horizontal_category') || 'none';
  const gender = searchParams.get('gender') || 'male';
  const state = searchParams.get('state') || '';
  const paperLanguage = searchParams.get('paper_language') || '';
  const marksRight = searchParams.get('marks_right') || '';
  const marksWrong = searchParams.get('marks_wrong') || '';
  const slug = searchParams.get('slug') || '';

  const fetchScorecard = (mRight, mWrong) => {
    let targetUrl = ansKeyUrl;
    let targetCategory = category;
    let targetHCategory = horizontalCategory;
    let targetGender = gender;
    let targetState = state;
    let targetLang = paperLanguage;
    let targetMarksRight = mRight !== undefined ? mRight : marksRight;
    let targetMarksWrong = mWrong !== undefined ? mWrong : marksWrong;
    let targetSlug = slug;

    if (typeof window !== 'undefined' && !targetUrl) {
      const stored = sessionStorage.getItem('cbtrank_form_data');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          targetUrl = parsed.ans_key_url || '';
          targetCategory = parsed.category || 'UR';
          targetHCategory = parsed.horizontal_category || 'none';
          targetGender = parsed.gender || 'male';
          targetState = parsed.state || '';
          targetLang = parsed.paper_language || '';
          if (targetMarksRight === '') targetMarksRight = parsed.marks_right || '';
          if (targetMarksWrong === '') targetMarksWrong = parsed.marks_wrong || '';
          targetSlug = parsed.slug || '';
        } catch (e) {}
      }
    }

    if (!targetUrl) {
      router.push('/answerkey');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    fetch('/api/answerkey/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ans_key_url: targetUrl,
        category: targetCategory,
        horizontal_category: targetHCategory,
        gender: targetGender,
        state: targetState,
        paper_language: targetLang,
        marks_right: targetMarksRight,
        marks_wrong: targetMarksWrong,
        slug: targetSlug,
      })
    })
      .then(res => res.json())
      .then(json => {
        setLoading(false);
        if (json.success && json.data) {
          setResultData(json.data);
          setCustomMarksRight(String(json.data.marksRight));
          setCustomMarksWrong(String(json.data.marksWrong));
        } else {
          setErrorMessage(json.error || 'Failed to process answer key response sheet.');
        }
      })
      .catch(err => {
        console.error('Result calculation error:', err);
        setLoading(false);
        setErrorMessage('Network error occurred while generating analysis.');
      });
  };

  useEffect(() => {
    fetchScorecard();
  }, [ansKeyUrl, category, horizontalCategory, gender, state, paperLanguage, marksRight, marksWrong, slug, router]);

  // Export Scorecard as Image PNG Handler
  const handleDownloadAsImage = async () => {
    if (typeof window === 'undefined' || downloadingImg) return;
    const cardElement = document.getElementById('cbrank-scorecard-card');
    if (!cardElement) return;

    setDownloadingImg(true);

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `CBTRank_Scorecard_${resultData?.rollNo || 'Candidate'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Scorecard PNG image export error:', err);
    } finally {
      setDownloadingImg(false);
    }
  };

  // Attach global handler for floating download button
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.downloadScorecardAsImage = handleDownloadAsImage;
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete window.downloadScorecardAsImage;
      }
    };
  }, [resultData, downloadingImg]);

  const handleRightMarksChange = (e) => {
    const val = e.target.value;
    setCustomMarksRight(val);
    if (val !== '' && !isNaN(parseFloat(val))) {
      fetchScorecard(val, customMarksWrong);
    }
  };

  const handleWrongMarksChange = (e) => {
    const val = e.target.value;
    setCustomMarksWrong(val);
    if (val !== '' && !isNaN(parseFloat(val))) {
      fetchScorecard(customMarksRight, val);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/70 flex flex-col items-center justify-center p-4 font-sans text-slate-800">
        <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl shadow-indigo-100/50 text-center space-y-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div>
            <h2 className="text-sm sm:text-lg font-black text-slate-900">Calculating Performance Metrics</h2>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-1 font-medium">Parsing candidate response sheet, right/wrong keys & shift percentile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage || !resultData) {
    return (
      <div className="min-h-screen bg-slate-50/70 flex flex-col items-center justify-center p-4 font-sans text-slate-800">
        <div className="bg-white/95 backdrop-blur-md border border-red-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-xl text-center space-y-4">
          <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-lg mx-auto font-bold">⚠️</div>
          <div>
            <h2 className="text-sm sm:text-lg font-black text-slate-900">Unable to Process Response Sheet</h2>
            <p className="text-xs text-red-600 mt-1 font-medium">{errorMessage || 'Invalid URL or response sheet could not be parsed.'}</p>
          </div>
          <Link 
            href="/answerkey" 
            className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            Back to Calculator
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-50/70 pt-0 sm:pt-1 pb-12 px-2.5 sm:px-6 lg:px-8 font-sans antialiased text-slate-900">
      <div className="max-w-4xl mx-auto space-y-3 sm:space-y-5">

        {/* SCORECARD REPORT CONTAINER */}
        <div id="cbrank-scorecard-card" className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 lg:p-6 pt-3 sm:pt-4 shadow-xl sm:shadow-2xl shadow-indigo-100/50 space-y-3.5 sm:space-y-5">
          
          {/* 1. DIRECT CANDIDATE & EXAM INFO SECTION */}
          <div className="border-b border-slate-200/90 pb-3.5 space-y-3">
            
            {/* Top Exam Header Logo & Exam Name (PERFECTLY CENTERED) */}
            <div className="space-y-2 text-center flex flex-col items-center justify-center">
              {resultData.headerImgUrl && (
                <div className="inline-block max-w-full overflow-hidden mx-auto">
                  <img 
                    src={resultData.headerImgUrl} 
                    alt="Exam Official Header Logo" 
                    className="max-h-16 sm:max-h-24 max-w-full h-auto w-auto object-contain block mx-auto text-center"
                  />
                </div>
              )}
              <h1 className="text-sm sm:text-base md:text-lg font-extrabold text-slate-900 tracking-tight leading-snug max-w-2xl mx-auto text-center">{resultData.examName}</h1>
            </div>

            {/* Candidate Metadata Grid (Clean Light Cards) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 text-xs">
              
              <div className="bg-slate-50 p-2.5 sm:p-3 rounded-lg sm:rounded-xl border border-slate-200/80 space-y-0.5 min-w-0">
                <span className="text-slate-500 block text-[9px] sm:text-[10px] uppercase font-bold tracking-wider truncate">Candidate Name</span>
                <span className="font-extrabold text-slate-900 text-[11px] sm:text-xs md:text-sm block truncate">{resultData.candidateName}</span>
              </div>

              <div className="bg-slate-50 p-2.5 sm:p-3 rounded-lg sm:rounded-xl border border-slate-200/80 space-y-0.5 min-w-0">
                <span className="text-slate-500 block text-[9px] sm:text-[10px] uppercase font-bold tracking-wider truncate">Roll / Participant No</span>
                <span className="font-mono font-bold text-blue-700 text-[11px] sm:text-xs md:text-sm block truncate">{resultData.rollNo}</span>
              </div>

              <div className="bg-slate-50 p-2.5 sm:p-3 rounded-lg sm:rounded-xl border border-slate-200/80 space-y-0.5 min-w-0">
                <span className="text-slate-500 block text-[9px] sm:text-[10px] uppercase font-bold tracking-wider truncate">Exam Date & Shift</span>
                <span className="font-semibold text-slate-800 text-[11px] sm:text-xs block truncate">{resultData.testDate} ({resultData.testTime})</span>
              </div>

              <div className="bg-slate-50 p-2.5 sm:p-3 rounded-lg sm:rounded-xl border border-slate-200/80 space-y-0.5 min-w-0">
                <span className="text-slate-500 block text-[9px] sm:text-[10px] uppercase font-bold tracking-wider truncate">Test Center</span>
                <span className="font-semibold text-slate-800 text-[11px] sm:text-xs block truncate">{resultData.testCenter}</span>
              </div>

            </div>

          </div>

          {/* 2. Section Wise Breakdown Table with PROMINENT BOLD VALUE TEXT */}
          <div className="space-y-2">
            
            {/* Minimal Inline Header Row */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <h3 className="text-[11px] sm:text-xs font-black text-slate-900 uppercase tracking-wider">
                Section-Wise Performance Summary
              </h3>

              {/* Slightly Larger Inline Auto-Recalculate Inputs */}
              <div className="flex items-center gap-3 bg-slate-100/90 px-3 py-1.5 rounded-xl border border-slate-200/90 text-xs shadow-sm">
                <label className="flex items-center gap-1.5 font-black text-slate-800">
                  <span className="text-emerald-600 font-black">+Right:</span>
                  <input 
                    type="number"
                    step="0.01"
                    value={customMarksRight}
                    onChange={handleRightMarksChange}
                    className="w-16 sm:w-20 bg-white border border-slate-300 rounded-lg px-2 py-1 font-mono text-xs sm:text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-black shadow-sm text-slate-900"
                  />
                </label>

                <label className="flex items-center gap-1.5 font-black text-slate-800">
                  <span className="text-red-500 font-black">-Wrong:</span>
                  <input 
                    type="number"
                    step="0.01"
                    value={customMarksWrong}
                    onChange={handleWrongMarksChange}
                    className="w-16 sm:w-20 bg-white border border-slate-300 rounded-lg px-2 py-1 font-mono text-xs sm:text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-black shadow-sm text-slate-900"
                  />
                </label>
              </div>

            </div>

            <div className="border border-slate-200/90 rounded-xl sm:rounded-2xl overflow-x-auto text-[11px] sm:text-xs shadow-sm -mx-0.5 sm:mx-0">
              <table className="w-full text-left min-w-[340px] sm:min-w-[500px]">
                <thead className="bg-slate-100/90 text-slate-900 font-black border-b border-slate-200">
                  <tr>
                    <th className="p-2.5 sm:p-3.5 whitespace-nowrap font-black">Section Name</th>
                    <th className="p-2.5 sm:p-3.5 whitespace-nowrap font-black">Total Qs</th>
                    <th className="p-2.5 sm:p-3.5 whitespace-nowrap hidden sm:table-cell font-black">Attempted</th>
                    <th className="p-2.5 sm:p-3.5 whitespace-nowrap hidden md:table-cell text-slate-700 font-black">Unattempted</th>
                    <th className="p-2.5 sm:p-3.5 text-emerald-700 whitespace-nowrap font-black">Right (+{resultData.marksRight})</th>
                    <th className="p-2.5 sm:p-3.5 text-red-600 whitespace-nowrap font-black">Wrong (-{resultData.marksWrong})</th>
                    <th className="p-2.5 sm:p-3.5 font-black text-slate-900 whitespace-nowrap">Raw Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-slate-900 font-bold">
                  {resultData.sections && resultData.sections.map((sec, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80">
                      <td className="p-2.5 sm:p-3.5 font-sans font-extrabold text-slate-900 whitespace-nowrap">{sec.name}</td>
                      <td className="p-2.5 sm:p-3.5 whitespace-nowrap font-extrabold text-slate-900">{sec.total}</td>
                      <td className="p-2.5 sm:p-3.5 whitespace-nowrap hidden sm:table-cell font-extrabold text-slate-900">{sec.attempted}</td>
                      <td className="p-2.5 sm:p-3.5 whitespace-nowrap hidden md:table-cell text-slate-700 font-bold">{sec.unattempted !== undefined ? sec.unattempted : (sec.total - sec.attempted)}</td>
                      <td className="p-2.5 sm:p-3.5 text-emerald-600 font-black whitespace-nowrap">{sec.correct}</td>
                      <td className="p-2.5 sm:p-3.5 text-red-500 font-black whitespace-nowrap">{sec.wrong}</td>
                      <td className="p-2.5 sm:p-3.5 font-black text-slate-900 whitespace-nowrap">{sec.rawScore}</td>
                    </tr>
                  ))}
                </tbody>
                {/* Total Summary Footer Row */}
                <tfoot className="bg-slate-100/90 font-mono border-t-2 border-slate-300 text-slate-900 font-black">
                  <tr>
                    <td className="p-2.5 sm:p-3.5 font-sans font-black text-slate-900 uppercase whitespace-nowrap">Total</td>
                    <td className="p-2.5 sm:p-3.5 font-black whitespace-nowrap text-slate-900">{resultData.totalQuestions}</td>
                    <td className="p-2.5 sm:p-3.5 font-black whitespace-nowrap hidden sm:table-cell text-slate-900">{resultData.attempted}</td>
                    <td className="p-2.5 sm:p-3.5 font-bold whitespace-nowrap hidden md:table-cell text-slate-700">{resultData.unattempted !== undefined ? resultData.unattempted : (resultData.totalQuestions - resultData.attempted)}</td>
                    <td className="p-2.5 sm:p-3.5 text-emerald-600 font-black whitespace-nowrap">{resultData.correct}</td>
                    <td className="p-2.5 sm:p-3.5 text-red-500 font-black whitespace-nowrap">{resultData.wrong}</td>
                    <td className="p-2.5 sm:p-3.5 font-black text-blue-700 whitespace-nowrap">{resultData.rawScore}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* 3. Key Metric Score Cards */}
          <div className="space-y-2.5 pt-1">
            <h3 className="text-[11px] sm:text-xs font-black text-slate-900 uppercase tracking-wider">
              Overall Score & Rank Analysis
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 text-center">
              
              <div className="bg-blue-50/80 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-blue-200/80 shadow-sm transition-all hover:shadow-md">
                <span className="text-[9px] sm:text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block mb-0.5">Raw Score</span>
                <span className="text-xl sm:text-2xl md:text-3xl font-black text-blue-600 font-mono">{resultData.rawScore}</span>
                <span className="text-[9px] sm:text-[10px] text-slate-400 block mt-0.5 font-medium">+{resultData.marksRight} / -{resultData.marksWrong}</span>
              </div>

              <div className="bg-emerald-50/80 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-emerald-200/80 shadow-sm transition-all hover:shadow-md">
                <span className="text-[9px] sm:text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block mb-0.5">Est. Normalized</span>
                <span className="text-xl sm:text-2xl md:text-3xl font-black text-emerald-600 font-mono">{resultData.normalizedScore}</span>
                <span className="text-[9px] sm:text-[10px] text-slate-400 block mt-0.5 font-medium">Pct: {resultData.percentile}%</span>
              </div>

              <div className="bg-purple-50/80 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-purple-200/80 shadow-sm transition-all hover:shadow-md">
                <span className="text-[9px] sm:text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block mb-0.5">Overall Rank</span>
                <span className="text-xl sm:text-2xl md:text-3xl font-black text-purple-600 font-mono">#{resultData.overallRank}</span>
                <span className="text-[9px] sm:text-[10px] text-slate-400 block mt-0.5 font-medium truncate">Total: {resultData.totalCandidates?.toLocaleString()}</span>
              </div>

              <div className="bg-indigo-50/80 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-indigo-200/80 shadow-sm transition-all hover:shadow-md">
                <span className="text-[9px] sm:text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block mb-0.5">Category Rank</span>
                <span className="text-xl sm:text-2xl md:text-3xl font-black text-indigo-600 font-mono">#{resultData.categoryRank}</span>
                <span className="text-[9px] sm:text-[10px] text-slate-400 block mt-0.5 font-medium truncate">Cat: {resultData.category}</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50/70 flex items-center justify-center p-4">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <ResultPageContent />
    </Suspense>
  );
}
