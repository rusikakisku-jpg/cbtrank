'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [passwordInput, setPasswordInput] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState('exams');

  const toggleSubmenu = (menu) => {
    setOpenSubmenu(openSubmenu === menu ? '' : menu);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === 'admin123' || passwordInput === 'admin') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect Password! Try "admin123"');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] flex items-center justify-center p-4">
        <div className="bg-[#1e293b] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#818cf8] to-[#c084fc]">
              CBTRANK PANEL
            </h1>
            <span className="inline-block bg-[#6366f1]/20 text-[#818cf8] border border-[#6366f1]/30 text-xs font-semibold px-3 py-1 rounded-full">
              ADMIN DASHBOARD ACCESS
            </span>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5 uppercase tracking-wider">
                Admin Password
              </label>
              <input 
                type="password" 
                placeholder="Enter password (default: admin123)" 
                value={passwordInput} 
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6366f1]"
                required
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-[#6366f1] to-[#4f46e5] hover:opacity-95 text-white font-bold py-3 rounded-xl shadow-lg transition-all text-sm"
            >
              Sign In to Dashboard &rarr;
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] font-sans antialiased flex flex-col">
      
      {/* FIXED GLASSMORPHISM HEADER */}
      <header className="h-[70px] bg-[#0f172a]/85 backdrop-blur-md border-b border-white/10 fixed top-0 left-0 right-0 z-50 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-white text-xl font-bold p-1 bg-transparent hover:opacity-80 cursor-pointer"
          >
            ☰
          </button>
          <span className="text-xl font-bold bg-gradient-to-r from-[#818cf8] to-[#c084fc] bg-clip-text text-transparent">
            CBTRANK PANEL
          </span>
          <span className="hidden sm:inline-block bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
            Cloudflare D1 & R2 Connected
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-[#94a3b8]">
            Hi, <strong className="text-white">Admin</strong>
          </span>
          <span className="bg-[#6366f1]/20 text-[#818cf8] border border-[#6366f1]/30 text-[11px] font-bold px-2.5 py-0.5 rounded-md">
            ADMIN
          </span>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="bg-[#ef4444] hover:bg-red-600 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* APP BODY WITH FIXED SIDEBAR AND MAIN CONTENT AREA */}
      <div className="flex pt-[70px] flex-1">
        
        {/* SIDEBAR NAVIGATION WITH REAL URL ROUTING */}
        <aside className={`bg-[#111827] border-r border-white/10 fixed top-[70px] bottom-0 z-40 overflow-y-auto p-3 space-y-1 transition-all duration-300 ${
          sidebarCollapsed ? 'w-[80px]' : 'w-[260px]'
        }`}>
          
          {/* User Profile Badge */}
          <div className="p-3 border-b border-white/10 mb-3 flex items-center gap-3">
            <div className="w-10 h-10 bg-[#6366f1] rounded-lg flex items-center justify-center font-bold text-white shrink-0">
              A
            </div>
            {!sidebarCollapsed && (
              <div>
                <p className="text-xs font-bold text-white">Admin User</p>
                <p className="text-[10px] text-[#94a3b8]">Administrator</p>
              </div>
            )}
          </div>

          {/* 🏠 Dashboard */}
          <Link 
            href="/admin"
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              pathname === '/admin' ? 'bg-[#6366f1] text-white font-bold shadow-md' : 'text-[#94a3b8] hover:bg-white/5 hover:text-white'
            }`}
          >
            <span>🏠</span> {!sidebarCollapsed && <span>Dashboard</span>}
          </Link>

          {/* 📝 Exams */}
          <div>
            <button 
              onClick={() => toggleSubmenu('exams')}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#94a3b8] hover:bg-white/5 hover:text-white transition-all"
            >
              <div className="flex items-center gap-3">
                <span>📝</span> {!sidebarCollapsed && <span>Exams</span>}
              </div>
              {!sidebarCollapsed && <span className="text-xs">{openSubmenu === 'exams' ? '▾' : '▸'}</span>}
            </button>

            {openSubmenu === 'exams' && !sidebarCollapsed && (
              <div className="pl-7 pt-1 space-y-1">
                <Link 
                  href="/admin/add-exam"
                  className={`block text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    pathname === '/admin/add-exam' ? 'bg-white/10 text-white font-bold' : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  Add New Exam
                </Link>
                <Link 
                  href="/admin/manage-exams"
                  className={`block text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    pathname === '/admin/manage-exams' ? 'bg-white/10 text-white font-bold' : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  Manage Exams
                </Link>
              </div>
            )}
          </div>

          {/* 🛠️ Quick Tools */}
          <div>
            <button 
              onClick={() => toggleSubmenu('tools')}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#94a3b8] hover:bg-white/5 hover:text-white transition-all"
            >
              <div className="flex items-center gap-3">
                <span>🛠️</span> {!sidebarCollapsed && <span>Quick Tools</span>}
              </div>
              {!sidebarCollapsed && <span className="text-xs">{openSubmenu === 'tools' ? '▾' : '▸'}</span>}
            </button>

            {openSubmenu === 'tools' && !sidebarCollapsed && (
              <div className="pl-7 pt-1 space-y-1">
                <a href="https://setup.cbtrank.com/latest1.php" target="_blank" className="block text-left px-3 py-1.5 rounded-lg text-xs text-[#94a3b8] hover:text-white">
                  🔗 URL Fetch
                </a>
                <a href="https://questionstore.quickgift.in/" target="_blank" className="block text-left px-3 py-1.5 rounded-lg text-xs text-[#94a3b8] hover:text-white">
                  📦 Question Store
                </a>
              </div>
            )}
          </div>

          {/* 📰 Blogs */}
          <div>
            <button 
              onClick={() => toggleSubmenu('blogs')}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#94a3b8] hover:bg-white/5 hover:text-white transition-all"
            >
              <div className="flex items-center gap-3">
                <span>📰</span> {!sidebarCollapsed && <span>Blogs</span>}
              </div>
              {!sidebarCollapsed && <span className="text-xs">{openSubmenu === 'blogs' ? '▾' : '▸'}</span>}
            </button>

            {openSubmenu === 'blogs' && !sidebarCollapsed && (
              <div className="pl-7 pt-1 space-y-1">
                <Link 
                  href="/admin/all-blogs"
                  className={`block text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    pathname === '/admin/all-blogs' ? 'bg-white/10 text-white font-bold' : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  All Articles
                </Link>
                <Link 
                  href="/admin/add-blog"
                  className={`block text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    pathname === '/admin/add-blog' ? 'bg-white/10 text-white font-bold' : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  Add New Article
                </Link>
              </div>
            )}
          </div>

          {/* 🌐 Language */}
          <div>
            <button 
              onClick={() => toggleSubmenu('lang')}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#94a3b8] hover:bg-white/5 hover:text-white transition-all"
            >
              <div className="flex items-center gap-3">
                <span>🌐</span> {!sidebarCollapsed && <span>Language</span>}
              </div>
              {!sidebarCollapsed && <span className="text-xs">{openSubmenu === 'lang' ? '▾' : '▸'}</span>}
            </button>

            {openSubmenu === 'lang' && !sidebarCollapsed && (
              <div className="pl-7 pt-1 space-y-1">
                <Link 
                  href="/admin/add-language"
                  className={`block text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    pathname === '/admin/add-language' ? 'bg-white/10 text-white font-bold' : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  Add Language
                </Link>
                <Link 
                  href="/admin/all-languages"
                  className={`block text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    pathname === '/admin/all-languages' ? 'bg-white/10 text-white font-bold' : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  All Languages
                </Link>
              </div>
            )}
          </div>

          {/* 📍 Location */}
          <div>
            <button 
              onClick={() => toggleSubmenu('loc')}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#94a3b8] hover:bg-white/5 hover:text-white transition-all"
            >
              <div className="flex items-center gap-3">
                <span>📍</span> {!sidebarCollapsed && <span>Location</span>}
              </div>
              {!sidebarCollapsed && <span className="text-xs">{openSubmenu === 'loc' ? '▾' : '▸'}</span>}
            </button>

            {openSubmenu === 'loc' && !sidebarCollapsed && (
              <div className="pl-7 pt-1 space-y-1">
                <Link 
                  href="/admin/add-location"
                  className={`block text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    pathname === '/admin/add-location' ? 'bg-white/10 text-white font-bold' : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  New Location
                </Link>
                <Link 
                  href="/admin/manage-locations"
                  className={`block text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    pathname === '/admin/manage-locations' ? 'bg-white/10 text-white font-bold' : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  Manage Locations
                </Link>
              </div>
            )}
          </div>

          {/* 👥 Users */}
          <div>
            <button 
              onClick={() => toggleSubmenu('users')}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#94a3b8] hover:bg-white/5 hover:text-white transition-all"
            >
              <div className="flex items-center gap-3">
                <span>👥</span> {!sidebarCollapsed && <span>Users</span>}
              </div>
              {!sidebarCollapsed && <span className="text-xs">{openSubmenu === 'users' ? '▾' : '▸'}</span>}
            </button>

            {openSubmenu === 'users' && !sidebarCollapsed && (
              <div className="pl-7 pt-1 space-y-1">
                <Link 
                  href="/admin/create-user"
                  className={`block text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    pathname === '/admin/create-user' ? 'bg-white/10 text-white font-bold' : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  Create User
                </Link>
                <Link 
                  href="/admin/user-directory"
                  className={`block text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    pathname === '/admin/user-directory' ? 'bg-white/10 text-white font-bold' : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  User Directory
                </Link>
              </div>
            )}
          </div>

          {/* ⚙️ Settings */}
          <Link 
            href="/admin/settings"
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              pathname === '/admin/settings' ? 'bg-[#6366f1] text-white font-bold shadow-md' : 'text-[#94a3b8] hover:bg-white/5 hover:text-white'
            }`}
          >
            <span>⚙️</span> {!sidebarCollapsed && <span>Settings</span>}
          </Link>

        </aside>

        {/* MAIN DASHBOARD CONTENT */}
        <main className={`flex-1 p-6 space-y-6 overflow-y-auto transition-all duration-300 ${
          sidebarCollapsed ? 'ml-[80px]' : 'ml-[260px]'
        }`}>
          <div className="bg-[#1e293b] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            {children}
          </div>
        </main>

      </div>

    </div>
  );
}
