'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function LayoutWrapper({ children, showBlogs = false }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar showBlogs={showBlogs} />
      <main className="flex-1 pt-[90px] pb-10">
        {children}
      </main>
      <Footer />
    </>
  );
}
