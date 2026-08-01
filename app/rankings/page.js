'use client';
import { useState } from 'react';

export default function RankingsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');

  const leaderboardData = [
    { rank: 1, name: 'Rahul S. (Roll: 2409****)', exam: 'RRB NTPC CBT-2', raw: 108.5, normalized: 114.2, category: 'UR', accuracy: '96.2%' },
    { rank: 2, name: 'Priya K. (Roll: 1802****)', exam: 'RRB NTPC CBT-2', raw: 106.0, normalized: 112.8, category: 'OBC', accuracy: '94.8%' },
    { rank: 3, name: 'Amit V. (Roll: 2104****)', exam: 'SSC CGL Tier-1', raw: 178.0, normalized: 185.4, category: 'EWS', accuracy: '93.5%' },
    { rank: 4, name: 'Sandeep M. (Roll: 1905****)', exam: 'RRB NTPC CBT-2', raw: 104.25, normalized: 111.0, category: 'UR', accuracy: '92.0%' },
    { rank: 5, name: 'Vikram R. (Roll: 3108****)', exam: 'IBPS PO Mains', raw: 142.0, normalized: 149.6, category: 'OBC', accuracy: '95.0%' },
    { rank: 6, name: 'Neha S. (Roll: 2701****)', exam: 'SSC CGL Tier-1', raw: 172.5, normalized: 179.8, category: 'SC', accuracy: '91.4%' },
    { rank: 7, name: 'Deepak T. (Roll: 1506****)', exam: 'RRB ALP CBT-1', raw: 68.0, normalized: 73.5, category: 'ST', accuracy: '90.2%' },
    { rank: 8, name: 'Anjali P. (Roll: 2203****)', exam: 'RRB NTPC CBT-2', raw: 101.5, normalized: 108.4, category: 'UR', accuracy: '93.1%' },
  ];

  const filteredData = leaderboardData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.exam.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'ALL' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Live Exam Leaderboard & Rankings</h1>
          <p className="text-xs text-gray-400 mt-1">Real-time candidate score normalization database across all shifts</p>
        </div>
        
        {/* Search & Filter */}
        <div className="flex items-center gap-3">
          <input 
            type="text" 
            placeholder="Search candidate or exam..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#0e1626] border border-gray-700 text-white text-xs rounded-xl px-4 py-2.5 w-56 focus:outline-none focus:border-indigo-500"
          />
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-[#0e1626] border border-gray-700 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="UR">UR</option>
            <option value="OBC">OBC</option>
            <option value="EWS">EWS</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
          </select>
        </div>
      </div>

      {/* Rankings Table */}
      <div className="bg-[#0e1626] border border-gray-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#080c14] text-gray-400 uppercase font-semibold border-b border-gray-800">
              <tr>
                <th className="p-4">Rank</th>
                <th className="p-4">Candidate / Masked Roll</th>
                <th className="p-4">Exam Target</th>
                <th className="p-4">Raw Score</th>
                <th className="p-4">Normalized Score</th>
                <th className="p-4">Category</th>
                <th className="p-4">Accuracy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 text-gray-300 font-medium">
              {filteredData.map((row) => (
                <tr key={row.rank} className="hover:bg-gray-900/50 transition-colors">
                  <td className="p-4">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-bold text-xs ${
                      row.rank === 1 ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40' :
                      row.rank === 2 ? 'bg-slate-300/20 text-slate-200 border border-slate-300/40' :
                      row.rank === 3 ? 'bg-amber-600/20 text-amber-400 border border-amber-600/40' :
                      'bg-gray-800 text-gray-400'
                    }`}>
                      #{row.rank}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-white">{row.name}</td>
                  <td className="p-4"><span className="bg-indigo-500/15 text-indigo-300 px-2.5 py-1 rounded-md">{row.exam}</span></td>
                  <td className="p-4 font-mono text-gray-300">{row.raw}</td>
                  <td className="p-4 font-mono font-bold text-emerald-400">{row.normalized}</td>
                  <td className="p-4"><span className="bg-gray-800 px-2 py-0.5 rounded text-[11px] font-bold">{row.category}</span></td>
                  <td className="p-4 text-purple-400 font-semibold">{row.accuracy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </main>
  );
}
