export const runtime = 'edge';

import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import Script from 'next/script';
import { firstD1 } from "@/lib/d1";

export const metadata = {
  title: "CBT RANK - Latest Answer Keys, Exam Marks & Rank Predictor",
  description: "Check latest CBT exam answer keys, marks calculation, category ranks, and shift score normalization for RRB, SSC, IBPS, and State Exams.",
  keywords: ["CBT RANK", "Answer Key Calculator", "RRB NTPC Answer Key", "SSC CGL Answer Key", "Rank Predictor"],
  openGraph: {
    title: "CBT RANK - Latest Answer Keys & Rank Predictor",
    description: "Select your exam to check marks, normalized score, and rank.",
    url: "https://cbtrank.com",
    siteName: "CBT RANK",
    type: "website",
  },
};

export default async function RootLayout({ children }) {
  let showBlogs = false;
  try {
    const blogSetting = await firstD1("SELECT setting_value FROM settings WHERE setting_key = 'show_blogs_section'");
    if (blogSetting && (String(blogSetting.setting_value) === '1')) {
      showBlogs = true;
    }
  } catch (e) {
    console.error("Error fetching show_blogs_section setting:", e);
  }

  return (
    <html lang="hi" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://cdn.onesignal.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

        {/* GA4 Script */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-RDZ060ZF0S"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RDZ060ZF0S');
          `}
        </Script>
      </head>

      <body className="min-h-full flex flex-col bg-[#0f172a] text-[#0f172a] font-sans antialiased">
        <LayoutWrapper showBlogs={showBlogs}>
          {children}
        </LayoutWrapper>

        {/* Google AdSense Asynchronous Script */}
        <Script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" 
          crossOrigin="anonymous" 
          strategy="afterInteractive" 
        />
      </body>
    </html>
  );
}
