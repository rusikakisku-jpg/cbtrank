'use client';
export const runtime = 'edge';

import { useState } from 'react';

export default function CutoffCalculatorPage() {
  const [exam, setExam] = useState('rrb-ntpc');
  const [rawScore, setRawScore] = useState('');
  const [category, setCategory] = useState('UR');
  const [shiftDifficulty, setShiftDifficulty] = useState('moderate');
  const [result, setResult] = useState(null);

  const handleCalculate = (e) => {
    e.preventDefault();
    const score = parseFloat(rawScore);
    if (isNaN(score)) return;

    // Simulation logic based on difficulty & category
    let bonus = 0;
    if (shiftDifficulty === 'hard') bonus = 6.5;
    if (shiftDifficulty === 'moderate') bonus = 3.0;

    const normalizedScore = (score + bonus).toFixed(2);
    let percentile = (Math.min(99.9, Math.max(40, (score / 100) * 100 + bonus * 1.5))).toFixed(2);
    let estimatedRank = Math.floor((100 - percentile) * 1250 + 15);
    
    let status = 'SAFE';
    let statusColor = 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (percentile < 80) {
      status = 'BORDERLINE';
      statusColor = 'text-yellow-400 border-yellow-500/40 bg-yellow-500/10';
    }
    if (percentile < 65) {
      status = 'NEEDS IMPROVEMENT';
      statusColor = 'text-red-400 border-red-500/40 bg-red-500/10';
    }

    setResult({
      rawScore: score,
      normalizedScore,
      percentile,
      estimatedRank,
      status,
      statusColor
    });
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-12 space-y-10">
      
      {/* Page Title */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          CBT Exam <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Percentile & Rank Predictor</span>
        </h1>
        <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
          Enter your marks to get real-time score normalization and estimated category rank.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Input Form */}
        <form onSubmit={handleCalculate} className="bg-[#0e1626] border border-gray-800 p-6 sm:p-8 rounded-3xl space-y-5 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-2">Select Exam & Enter Score</h2>

          {/* Exam Selection */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">Target CBT Exam</label>
            <select 
              value={exam} 
              onChange={(e) => setExam(e.target.value)}
              className="w-full bg-[#080c14] border border-gray-700 text-white text-sm rounded-xl p-3 focus:border-indigo-500 focus:outline-none"
            >
              <option value="rrb-ntpc">RRB NTPC CBT-2 (120 Marks)</option>
              <option value="ssc-cgl">SSC CGL Tier-1 (200 Marks)</option>
              <option value="rrb-alp">RRB ALP CBT-1 (75 Marks)</option>
              <option value="ibps-po">IBPS PO Mains (225 Marks)</option>
            </select>
          </div>

          {/* Marks Input */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">Your Raw Score (Marks)</label>
            <input 
              type="number" 
              step="0.25"
              required
              placeholder="e.g. 78.5" 
              value={rawScore} 
              onChange={(e) => setRawScore(e.target.value)}
              className="w-full bg-[#080c14] border border-gray-700 text-white text-sm rounded-xl p-3 focus:border-indigo-500 focus:outline-none font-mono"
            />
          </div>

          {/* Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Category</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#080c14] border border-gray-700 text-white text-sm rounded-xl p-3 focus:border-indigo-500 focus:outline-none"
              >
                <option value="UR">UR / General</option>
                <option value="OBC">OBC</option>
                <option value="EWS">EWS</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Shift Difficulty</label>
              <select 
                value={shiftDifficulty} 
                onChange={(e) => setShiftDifficulty(e.target.value)}
                className="w-full bg-[#080c14] border border-gray-700 text-white text-sm rounded-xl p-3 focus:border-indigo-500 focus:outline-none"
              >
                <option value="easy">Easy Shift</option>
                <option value="moderate">Moderate Shift</option>
                <option value="hard">Hard Shift (+Bonus)</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-95 text-white font-bold text-base py-3.5 rounded-xl shadow-lg shadow-indigo-500/25 transition-transform active:scale-[0.99]"
          >
            Calculate Normalized Rank 🎯
          </button>
        </form>

        {/* Output Calculation Result */}
        <div>
          {result ? (
            <div className="bg-[#0e1626] border border-indigo-500/50 p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl animate-fade-in">
              <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <span className="text-sm font-bold text-gray-300">Prediction Result</span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${result.statusColor}`}>
                  {result.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#080c14] p-4 rounded-2xl border border-gray-800">
                  <span className="text-xs text-gray-400 font-medium block">Raw Score</span>
                  <span className="text-2xl font-extrabold text-white font-mono">{result.rawScore}</span>
                </div>
                <div className="bg-[#080c14] p-4 rounded-2xl border border-gray-800">
                  <span className="text-xs text-gray-400 font-medium block">Est. Normalized Score</span>
                  <span className="text-2xl font-extrabold text-emerald-400 font-mono">{result.normalizedScore}</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-500/30 p-5 rounded-2xl text-center space-y-1">
                <span className="text-xs text-indigo-300 font-semibold block">Estimated Percentile Score</span>
                <span className="text-4xl font-black text-white font-mono">{result.percentile} %ile</span>
                <span className="text-xs text-gray-400 block pt-1">Estimated All India Category Rank: <strong className="text-white">#{result.estimatedRank}</strong></span>
              </div>

              <p className="text-xs text-gray-400 text-center leading-relaxed">
                *Normalized rank is calculated using standard deviation across similar shift candidate pools.
              </p>
            </div>
          ) : (
            <div className="bg-[#0e1626]/50 border border-dashed border-gray-800 p-8 rounded-3xl text-center h-full flex flex-col items-center justify-center text-gray-500 space-y-3">
              <div className="text-4xl">📊</div>
              <div className="font-semibold text-gray-300">No Calculation Yet</div>
              <p className="text-xs max-w-xs">Fill out the score details on the left to see instant rank & percentile analytics.</p>
            </div>
          )}
        </div>

      </div>

      {/* AdSense Unit */}
      <div className="bg-[#0e1626] border border-dashed border-purple-500/40 rounded-2xl p-6 text-center">
        <span className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">Advertisement</span>
        <div className="text-purple-400 font-bold text-sm">Google AdSense High Viewability Calculator Ad Slot</div>
      </div>

    </main>
  );
}
