'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();
  const isResultPage = pathname === '/result';

  const handleDownloadImage = () => {
    if (typeof window !== 'undefined' && typeof window.downloadScorecardAsImage === 'function') {
      window.downloadScorecardAsImage();
    }
  };

  return (
    <>
      <footer className="bg-[#0044cc] text-white border-t-[3px] border-[#003399] py-5 mt-auto">
        <div className="w-[90%] max-w-[1100px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
          
          {/* LEFT: Footer Menu */}
          <nav className="footer-menu">
            <ul className="flex flex-wrap items-center justify-center md:justify-start gap-[18px] font-medium text-white text-sm sm:text-base">
              <li><Link href="/" className="hover:underline">Home</Link></li>
              <li><Link href="/about-us" className="hover:underline">About Us</Link></li>
              <li><Link href="/contact-us" className="hover:underline">Contact Us</Link></li>
              <li><Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link></li>
              <li><Link href="/terms-and-conditions" className="hover:underline">Terms and Conditions</Link></li>
              <li><Link href="/disclaimer" className="hover:underline">Disclaimer</Link></li>
            </ul>
          </nav>

          {/* RIGHT: Copyright Text */}
          <div className="text-center md:text-right font-medium text-sm sm:text-base whitespace-nowrap pt-1 md:pt-0">
            © {currentYear} CBTRANK.COM | All Rights Reserved
          </div>

        </div>
      </footer>

      {/* FLOATING ACTION BUTTON: Download Scorecard Image PNG Icon on /result page, Telegram Icon on all other pages */}
      {isResultPage ? (
        <button 
          onClick={handleDownloadImage}
          className="fixed bottom-5 right-5 z-[9999] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-full p-4 shadow-2xl shadow-indigo-950/60 hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer border-2 border-white"
          title="Download Scorecard as PNG Image"
          aria-label="Download Scorecard as PNG Image"
        >
          <svg className="w-7 h-7 text-white fill-current" viewBox="0 0 24 24">
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
          </svg>
        </button>
      ) : (
        <a 
          href="https://t.me/cbtrank" 
          target="_blank" 
          rel="noopener noreferrer"
          className="fixed bottom-[20px] right-[20px] z-[9999] w-[70px] h-[70px] flex items-center justify-center transition-transform duration-200 hover:scale-110"
          title="Join Telegram Channel"
        >
          <img 
            src="https://cdn-icons-png.flaticon.com/512/2111/2111646.png" 
            alt="Telegram" 
            className="w-[55px] h-[55px] drop-shadow-md"
          />
        </a>
      )}
    </>
  );
}
