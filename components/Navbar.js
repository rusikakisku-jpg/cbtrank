'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#0044cc] text-white shadow-md">
      <div className="w-[95%] max-w-[1200px] mx-auto h-[70px] flex items-center justify-between">
        
        {/* Logo & Branding */}
        <div className="flex items-center gap-2.5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-white text-[#0044cc] font-extrabold flex items-center justify-center text-lg shadow-inner">
              CBT
            </div>
            <span className="text-2xl font-bold text-white tracking-wide hover:opacity-95 transition-opacity">
              CBT RANK
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Links (EXACT match with original PHP header.php) */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-6 font-medium text-sm text-white">
            <li><Link href="/" className="hover:text-blue-100 transition-colors">Home</Link></li>
            <li><Link href="/answerkey" className="hover:text-blue-100 transition-colors">Answer Key</Link></li>
            <li><Link href="/blogs" className="hover:text-blue-100 transition-colors">Blog</Link></li>
          </ul>
        </nav>

        {/* Mobile Hamburger Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex flex-col justify-center items-center gap-1.5 w-10 h-10 rounded-lg hover:bg-blue-700 transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          <span className={`w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>

      </div>

      {/* Mobile Slide-Down Menu Drawer (EXACT match with original PHP header.php) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#003399] border-t border-blue-600 px-6 py-4 space-y-3 animate-fade-in">
          <Link 
            href="/" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-white font-semibold py-2 border-b border-blue-500/40 hover:text-blue-200"
          >
            Home
          </Link>
          <Link 
            href="/answerkey" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-white font-semibold py-2 border-b border-blue-500/40 hover:text-blue-200"
          >
            Answer Key
          </Link>
          <Link 
            href="/blogs" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-white font-semibold py-2 hover:text-blue-200"
          >
            Blog
          </Link>
        </div>
      )}
    </header>
  );
}
