export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { queryD1, firstD1 } from '@/lib/d1';

// Helper function to decode HTML entities and clean extra whitespace/&nbsp;
function cleanText(str) {
  if (!str) return '';
  let clean = str
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#039;/gi, "'")
    .replace(/[\u00A0\u200B]/g, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/^[\s:\-\x00-\x1F]+/g, '')
    .replace(/[\s:\-\x00-\x1F]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return clean;
}

// Resolve relative image URLs against base URL
function resolveAbsoluteUrl(src, baseUrl) {
  if (!src) return '';
  src = src.trim();
  if (/^https?:\/\//i.test(src) || src.startsWith('data:')) return src;
  try {
    const base = new URL(baseUrl);
    return new URL(src, base).href;
  } catch (e) {
    return src;
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    let {
      ans_key_url,
      category = 'UR',
      horizontal_category = 'none',
      gender = 'male',
      state = '',
      paper_language = '',
      marks_right,
      marks_wrong,
      slug = '',
    } = body;

    if (!ans_key_url || !ans_key_url.trim()) {
      return NextResponse.json({ error: 'Official Answer Key / Response Sheet URL is required.' }, { status: 400 });
    }

    let cleanUrl = ans_key_url.trim();

    // Auto-prepend https:// if missing
    if (!/^https?:\/\//i.test(cleanUrl)) {
      cleanUrl = 'https://' + cleanUrl;
    }

    // Must be a valid HTTP/HTTPS URL
    let parsedUrl;
    try {
      parsedUrl = new URL(cleanUrl);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid URL format. Please paste a valid official response sheet URL.' }, { status: 400 });
    }

    const host = parsedUrl.hostname.toLowerCase();

    // ── Helper: check digialm.com or subdomains ──
    const isDigialm = host === 'digialm.com' || host.endsWith('.digialm.com');

    // ── Helper: check cbexams.com or subdomains ──
    const isCbexams = host === 'cbexams.com' || host.endsWith('.cbexams.com');

    // ── DOMAIN CHECK: Only digialm.com or cbexams.com allowed ──
    if (!isDigialm && !isCbexams) {
      try {
        await queryD1(
          'INSERT INTO invalid_answerkey_urls (url, created_at) VALUES (?, DATETIME("now"))',
          [cleanUrl]
        );
      } catch (e) {}
      return NextResponse.json(
        { error: 'Enter Official Answerkey Url' },
        { status: 400 }
      );
    }

    // ── digialm.com: URL must end with .html ──
    if (isDigialm && !parsedUrl.pathname.toLowerCase().endsWith('.html')) {
      return NextResponse.json(
        { error: 'Enter Official Answerkey Url' },
        { status: 400 }
      );
    }

    // ── Fetch the response sheet HTML (with 10s timeout) ──
    let htmlContent = '';
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(cleanUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8'
        },
        cache: 'no-store'
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        htmlContent = await res.text();
      }
    } catch (e) {
      console.error('Fetch error for URL:', cleanUrl, e);
    }

    // ── digialm.com: page must contain 'main-info-pnl' ──
    if (isDigialm) {
      if (!htmlContent || !htmlContent.toLowerCase().includes('main-info-pnl')) {
        try {
          await queryD1(
            'INSERT INTO invalid_answerkey_urls (url, created_at) VALUES (?, DATETIME("now"))',
            [cleanUrl]
          );
        } catch (e) {}
        return NextResponse.json(
          { error: 'Link either expired or broken.' },
          { status: 400 }
        );
      }
    }

    // ── cbexams.com: page must contain <td class="bld"> ──
    if (isCbexams) {
      const cb = (htmlContent || '').toLowerCase();
      const hasBld = cb.includes('<td class="bld">') || cb.includes("<td class='bld'>") || cb.includes('td class="bld"');
      if (!htmlContent || !hasBld) {
        try {
          await queryD1(
            'INSERT INTO invalid_answerkey_urls (url, created_at) VALUES (?, DATETIME("now"))',
            [cleanUrl]
          );
        } catch (e) {}
        return NextResponse.json(
          { error: 'Link either expired or broken.' },
          { status: 400 }
        );
      }
    }

    // ── URL is valid — log to valid_answerkey_urls ──
    try {
      await queryD1(
        'INSERT INTO valid_answerkey_urls (url, created_at) VALUES (?, DATETIME("now"))',
        [cleanUrl]
      );
    } catch (e) {}

    // ── Priority: user-specified marks, then DB marks ──
    let marksRight = 1.0;
    let marksWrong = 0.25;
    let examTitle = 'Competitive Exam Answer Key';

    if (marks_right !== undefined && marks_right !== null && marks_right !== '' && !isNaN(parseFloat(marks_right))) {
      marksRight = parseFloat(marks_right);
    }
    if (marks_wrong !== undefined && marks_wrong !== null && marks_wrong !== '' && !isNaN(parseFloat(marks_wrong))) {
      marksWrong = parseFloat(marks_wrong);
    }

    if (slug) {
      const examRow = await firstD1('SELECT title, marks_right, marks_wrong FROM exams WHERE slug = ? LIMIT 1', [slug]);
      if (examRow) {
        if (examRow.title) examTitle = cleanText(examRow.title);
        if (marks_right === undefined && examRow.marks_right !== null && examRow.marks_right !== undefined) {
          marksRight = parseFloat(examRow.marks_right);
        }
        if (marks_wrong === undefined && examRow.marks_wrong !== null && examRow.marks_wrong !== undefined) {
          marksWrong = parseFloat(examRow.marks_wrong);
        }
      }
    }

    // ── ROUTE to dedicated provider parser ──
    let parsed;
    if (isDigialm) {
      const { parseDigialm } = await import('./parsers/digialm.js');
      parsed = parseDigialm(htmlContent, marksRight, marksWrong, slug);
    } else {
      const { parseCbexams } = await import('./parsers/cbexams.js');
      parsed = await parseCbexams(htmlContent, marksRight, marksWrong, cleanUrl, slug);
    }

    // Apply fallback defaults for empty candidate fields
    if (!parsed.candidateName) parsed.candidateName = 'Candidate (Verified)';
    if (!parsed.rollNo)        parsed.rollNo        = 'N/A';
    if (!parsed.testCenter)    parsed.testCenter    = 'Online CBT Exam Center';
    if (!parsed.testDate)      parsed.testDate      = '';
    if (!parsed.testTime)      parsed.testTime      = '';
    if (!parsed.headerImgUrl)  parsed.headerImgUrl  = '';

    // Resolve relative image URLs
    if (parsed.headerImgUrl && !parsed.headerImgUrl.startsWith('http')) {
      parsed.headerImgUrl = resolveAbsoluteUrl(parsed.headerImgUrl, cleanUrl);
    }

    // ── REAL D1-BASED RANKING SYSTEM ──
    let realOverallRank = parsed.overallRank;
    let realOverallTotal = parsed.totalCandidates;
    let realCategoryRank = parsed.categoryRank;
    let realCategoryTotal = Math.round(parsed.totalCandidates * 0.28);
    let realShiftRank = Math.max(1, Math.round(parsed.overallRank * 0.15));
    let realShiftTotal = Math.round(parsed.totalCandidates * 0.15);

    try {
      // Ensure user_ranks table exists
      await queryD1(`
        CREATE TABLE IF NOT EXISTS user_ranks (
          url_hash TEXT PRIMARY KEY,
          url TEXT,
          exam_slug TEXT,
          total_marks REAL,
          category TEXT,
          gender TEXT,
          test_date TEXT,
          test_time TEXT,
          created_at TEXT,
          updated_at TEXT
        )
      `);

      // Hash cleanUrl
      const msgUint8 = new TextEncoder().encode(cleanUrl);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
      const urlHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

      const targetSlug = slug || 'default';
      const targetScore = parsed.rawScore;

      // Upsert current submission score into user_ranks
      await queryD1(`
        INSERT INTO user_ranks (url_hash, url, exam_slug, total_marks, category, gender, test_date, test_time, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, DATETIME('now'), DATETIME('now'))
        ON CONFLICT(url_hash) DO UPDATE SET
          total_marks = excluded.total_marks,
          category = excluded.category,
          gender = excluded.gender,
          test_date = excluded.test_date,
          test_time = excluded.test_time,
          updated_at = DATETIME('now')
      `, [urlHash, cleanUrl, targetSlug, targetScore, category, gender, parsed.testDate, parsed.testTime]);

      // Query real DB ranks
      const higherCountRow = await firstD1(`SELECT COUNT(*) as cnt FROM user_ranks WHERE exam_slug = ? AND total_marks > ?`, [targetSlug, targetScore]);
      const totalCountRow = await firstD1(`SELECT COUNT(*) as cnt FROM user_ranks WHERE exam_slug = ?`, [targetSlug]);
      
      const catHigherRow = await firstD1(`SELECT COUNT(*) as cnt FROM user_ranks WHERE exam_slug = ? AND category = ? AND total_marks > ?`, [targetSlug, category, targetScore]);
      const catTotalRow = await firstD1(`SELECT COUNT(*) as cnt FROM user_ranks WHERE exam_slug = ? AND category = ?`, [targetSlug, category]);

      let shiftHigherRow = null;
      let shiftTotalRow = null;
      if (parsed.testDate && parsed.testTime) {
        shiftHigherRow = await firstD1(`SELECT COUNT(*) as cnt FROM user_ranks WHERE exam_slug = ? AND test_date = ? AND test_time = ? AND total_marks > ?`, [targetSlug, parsed.testDate, parsed.testTime, targetScore]);
        shiftTotalRow = await firstD1(`SELECT COUNT(*) as cnt FROM user_ranks WHERE exam_slug = ? AND test_date = ? AND test_time = ?`, [targetSlug, parsed.testDate, parsed.testTime]);
      }

      if (totalCountRow && totalCountRow.cnt > 0) {
        realOverallRank = (higherCountRow?.cnt || 0) + 1;
        realOverallTotal = totalCountRow.cnt;
      }

      if (catTotalRow && catTotalRow.cnt > 0) {
        realCategoryRank = (catHigherRow?.cnt || 0) + 1;
        realCategoryTotal = catTotalRow.cnt;
      }

      if (shiftTotalRow && shiftTotalRow.cnt > 0) {
        realShiftRank = (shiftHigherRow?.cnt || 0) + 1;
        realShiftTotal = shiftTotalRow.cnt;
      }
    } catch (e) {
      console.error('D1 Rank Calculation Warning:', e);
    }

    return NextResponse.json({
      success: true,
      data: {
        candidateName:      parsed.candidateName,
        rollNo:             parsed.rollNo,
        examName:           examTitle || parsed.examTitle || 'Answer Key Result',
        headerImgUrl:       parsed.headerImgUrl,
        testCenter:         parsed.testCenter,
        testDate:           parsed.testDate,
        testTime:           parsed.testTime,
        totalQuestions:     parsed.totalQuestions,
        attempted:          parsed.attempted,
        correct:            parsed.correct,
        wrong:              parsed.wrong,
        unattempted:        parsed.unattempted,
        marksRight:         parsed.marksRight,
        marksWrong:         parsed.marksWrong,
        rawScore:           parsed.rawScore,
        normalizedScore:    parsed.normalizedScore,
        percentile:         parsed.percentile,
        overallRank:        realOverallRank,
        categoryRank:       realCategoryRank,
        shiftRank:          realShiftRank,
        totalCandidates:    realOverallTotal,
        categoryTotal:      realCategoryTotal,
        shiftTotal:         realShiftTotal,
        category,
        horizontalCategory: horizontal_category,
        gender,
        state,
        paperLanguage:      paper_language,
        provider:           parsed.provider,
        infoRows:           parsed.infoRows || [],
        sections:           parsed.sections,
      }
    });

  } catch (error) {
    console.error('Answer Key Calculation API Error:', error);
    return NextResponse.json({ error: 'Failed to process answer key URL. Please check the URL and Formula parameters.' }, { status: 500 });
  }
}
