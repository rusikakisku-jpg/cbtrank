/**
 * cbexams.js — Dedicated parser for cbexams.com response sheets
 * Ported from cbexams_sscexam.php (PHP original)
 *
 * Key HTML structure of cbexams.com pages:
 *  td.bld pairs          → candidate info (label/value pairs)
 *  table[@width='85%']   → main question container
 *    table[@width='100%'] containing 'Q.No' → individual question tables
 *      td[@bgcolor='green']  → correct answer (right)
 *      td[@bgcolor='red']    → wrong answer
 *      td[@bgcolor='gray']   → unattempted
 *      "not answered" text   → unattempted
 *  span#lblsubject           → section/subject name
 */

// ── Normalize whitespace ──
function normText(t) {
  if (!t) return '';
  return t.replace(/[\u00A0\u200B]/g, ' ').replace(/\s+/g, ' ').trim();
}

// ── Extract candidate info from td.bld key-value pairs ──
function extractCandidateInfo(html) {
  const info = {
    candidateName: '',
    rollNo: '',
    testCenter: '',
    testDate: '',
    testTime: '',
    headerImgUrl: '',
    examTitle: '',
  };

  // Header image from first tr containing img + mtext
  const imgMatch = html.match(/<img[^>]+src=['"]([^'"]+)['"]/i);
  if (imgMatch) info.headerImgUrl = imgMatch[1];

  // Extract exam title from mtext class
  const mtextMatch = html.match(/class=['"][^'"]*mtext[^'"]*['"][^>]*>([\s\S]*?)<\/(?:font|span|td)>/i);
  if (mtextMatch) info.examTitle = normText(mtextMatch[1].replace(/<[^>]+>/g, ''));

  // Extract td.bld pairs — label in one td.bld, value in next td.bld
  const bldMatches = [...html.matchAll(/class=['"][^'"]*\bbld\b[^'"]*['"][^>]*>([\s\S]*?)<\/(?:td|font)>/gi)];
  const vals = bldMatches.map(m => {
    let text = normText(m[1].replace(/<[^>]+>/g, ''));
    // Handle select elements — extract selected option text
    const selectMatch = m[0].match(/<option[^>]*selected[^>]*>([\s\S]*?)<\/option>/i)
      || m[0].match(/<option[^>]*>([\s\S]*?)<\/option>/i);
    if (selectMatch) text = normText(selectMatch[1].replace(/<[^>]+>/g, ''));
    return text.replace(/^[:\s\u00A0]+/, '');
  });

  for (let i = 0; i < vals.length - 1; i += 2) {
    const label = (vals[i] || '').toLowerCase();
    const value = vals[i + 1] || '';
    if (label.includes('roll') || label.includes('participant id') || label.includes('candidate id')) {
      info.rollNo = value;
    } else if (label.includes('candidate name') || label.includes('participant name') || label.includes('student name')) {
      info.candidateName = value;
    } else if (label.includes('test center') || label.includes('exam center') || label.includes('center name')) {
      info.testCenter = value;
    } else if (label.includes('test date') || label.includes('exam date') || label === 'date') {
      info.testDate = value;
    } else if (label.includes('test time') || label.includes('shift') || label.includes('time')) {
      info.testTime = value;
    }
  }

  return info;
}

// ── Parse questions: each question is a table[@width='100%'] containing 'Q.No' ──
// Color detection: bgcolor=green → right, bgcolor=red → wrong, bgcolor=gray or "not answered" text → unattempted
function parseQuestions(html, marksRight, marksWrong) {
  // Find all question tables inside table[@width='85%'] first, or globally
  // We look for tables that contain 'Q.No' text and have bgcolor color indicators
  const qTablePattern = /<table[^>]*width=['"]100%['"][^>]*>([\s\S]*?)<\/table>/gi;
  const allTables = [...html.matchAll(qTablePattern)];

  // Filter only those containing 'Q.No'
  const qTables = allTables.filter(t => /Q\.No/i.test(t[1]));

  let totalQuestions = qTables.length;
  let right = 0, wrong = 0, unattempted = 0;

  // Per-section tracking via lblsubject spans
  const sections = [];
  let currentSection = 'Section 1';
  let secRight = 0, secWrong = 0, secUnattempted = 0, secTotal = 0;

  for (const qt of qTables) {
    const inner = qt[1];
    const innerLower = inner.toLowerCase();

    // Detect colors
    const bgColors = [...inner.matchAll(/bgcolor=['"]([^'"]+)['"]/gi)].map(m => m[1].toLowerCase());
    const hasGreen = bgColors.some(c => c.includes('green'));
    const hasRed = bgColors.some(c => c.includes('red'));
    const hasGray = bgColors.some(c => c.includes('gray') || c.includes('grey'));
    const hasNotAnswered = innerLower.includes('not answered') || innerLower.includes('not attempted') || innerLower.includes('not attempt');

    secTotal++;

    if (hasGray || hasNotAnswered) {
      unattempted++;
      secUnattempted++;
    } else if (hasGreen) {
      right++;
      secRight++;
    } else if (hasRed) {
      wrong++;
      secWrong++;
    } else {
      // No color indicator — count as unattempted
      unattempted++;
      secUnattempted++;
    }
  }

  // Build section from lblsubject spans if available
  const lblMatches = [...html.matchAll(/id=['"]lblsubject['"][^>]*>([\s\S]*?)<\/span>/gi)];
  if (lblMatches.length > 0) {
    // Multiple sections
    const sectionNames = lblMatches.map(m => {
      const full = normText(m[1].replace(/<[^>]+>/g, ''));
      // Extract content inside last parentheses
      const inParen = full.match(/\(([^)]+)\)\s*$/);
      return inParen ? inParen[1].trim() : full;
    });
    // Distribute questions evenly per section (approximation — cbexams pages may have one page per section)
    if (sectionNames.length === 1) {
      sections.push({
        name: sectionNames[0] || 'Full Exam',
        total: totalQuestions,
        attempted: right + wrong,
        correct: right,
        wrong,
        unattempted,
        rawScore: parseFloat(((right * marksRight) - (wrong * marksWrong)).toFixed(2)),
      });
    } else {
      sections.push({
        name: sectionNames[0] || 'Section 1',
        total: totalQuestions,
        attempted: right + wrong,
        correct: right,
        wrong,
        unattempted,
        rawScore: parseFloat(((right * marksRight) - (wrong * marksWrong)).toFixed(2)),
      });
    }
  } else {
    sections.push({
      name: 'Full Exam',
      total: totalQuestions,
      attempted: right + wrong,
      correct: right,
      wrong,
      unattempted,
      rawScore: parseFloat(((right * marksRight) - (wrong * marksWrong)).toFixed(2)),
    });
  }

  return { sections, totalQuestions, attempted: right + wrong, correct: right, wrong, unattempted };
}

// ── Helper to build variant section URLs ──
function buildVariantUrl(baseUrl, index) {
  try {
    const urlObj = new URL(baseUrl);
    const pathname = urlObj.pathname;
    const segments = pathname.split('/');
    let filename = segments[segments.length - 1];

    let newFilename = filename;
    if (/^ViewCandResponse\d*\.aspx$/i.test(filename)) {
      newFilename = index === 1 ? 'ViewCandResponse.aspx' : `ViewCandResponse${index}.aspx`;
    } else if (filename.toLowerCase().includes('viewcandresponse')) {
      newFilename = filename.replace(/ViewCandResponse\d*/i, index === 1 ? 'ViewCandResponse' : `ViewCandResponse${index}`);
    } else {
      newFilename = index === 1 ? 'ViewCandResponse.aspx' : `ViewCandResponse${index}.aspx`;
    }

    segments[segments.length - 1] = newFilename;
    urlObj.pathname = segments.join('/');
    return urlObj.href;
  } catch (e) {
    return baseUrl;
  }
}

// ── Parse single variant section HTML page ──
function parseSingleSectionPage(html, sectionIndex, marksRight, marksWrong) {
  // Find subject / section title from #lblsubject or <title>
  let sectionTitle = `Section ${sectionIndex}`;
  const lblSubjectMatch = html.match(/id=['"]lblsubject['"][^>]*>([\s\S]*?)<\/span>/i);
  if (lblSubjectMatch) {
    const full = normText(lblSubjectMatch[1].replace(/<[^>]+>/g, ''));
    const inParen = full.match(/\(([^)]+)\)\s*$/);
    sectionTitle = inParen ? inParen[1].trim() : full;
  } else {
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    if (titleMatch) {
      const tText = normText(titleMatch[1].replace(/<[^>]+>/g, ''));
      if (tText && !tText.toLowerCase().includes('cbexam')) sectionTitle = tText;
    }
  }

  // Find all question tables (table with width=100% containing Q.No)
  const qTablePattern = /<table[^>]*width=['"]100%['"][^>]*>([\s\S]*?)<\/table>/gi;
  const allTables = [...html.matchAll(qTablePattern)];
  const qTables = allTables.filter(t => /Q\.No/i.test(t[1]));

  let secTotal = qTables.length;
  let secRight = 0, secWrong = 0, secUnattempted = 0;

  for (const qt of qTables) {
    const inner = qt[1];
    const innerLower = inner.toLowerCase();

    const bgColors = [...inner.matchAll(/bgcolor=['"]([^'"]+)['"]/gi)].map(m => m[1].toLowerCase());
    const hasGreen = bgColors.some(c => c.includes('green'));
    const hasRed = bgColors.some(c => c.includes('red'));
    const hasGray = bgColors.some(c => c.includes('gray') || c.includes('grey'));
    const hasNotAnswered = innerLower.includes('not answered') || innerLower.includes('not attempted') || innerLower.includes('not attempt');

    if (hasGray || hasNotAnswered) {
      secUnattempted++;
    } else if (hasGreen) {
      secRight++;
    } else if (hasRed) {
      secWrong++;
    } else {
      secUnattempted++;
    }
  }

  const secAttempted = secRight + secWrong;
  const secRawScore = parseFloat(((secRight * marksRight) - (secWrong * marksWrong)).toFixed(2));

  return {
    section: {
      name: sectionTitle,
      total: secTotal,
      attempted: secAttempted,
      correct: secRight,
      wrong: secWrong,
      unattempted: secUnattempted,
      rawScore: secRawScore,
    },
    totalQuestions: secTotal,
    attempted: secAttempted,
    correct: secRight,
    wrong: secWrong,
    unattempted: secUnattempted,
  };
}

// ── MAIN: Parse cbexams.com HTML (with multi-page section support) ──
export async function parseCbexams(html, marksRight, marksWrong, cleanUrl = '', slug = '') {
  const candidateInfo = extractCandidateInfo(html);

  // Count section inputs in main HTML
  const inputMatches = [...html.matchAll(/<table[^>]*width=['"]30%['"][^>]*>[\s\S]*?<input/gi)]
    .concat([...html.matchAll(/<input[^>]*name=['"]P[^'"]*['"]/gi)]);
  
  let totalInputs = inputMatches.length;
  if (totalInputs <= 0) {
    // fallback check for generic inputs inside response table
    const genericInputs = [...html.matchAll(/<input[^>]*type=['"]button['"][^>]*>/gi)];
    totalInputs = Math.max(1, genericInputs.length);
  }

  const sectionPages = [html];

  // If there are multiple section inputs and cleanUrl is provided, fetch variant section pages
  if (totalInputs > 1 && cleanUrl) {
    const fetchPromises = [];
    const maxFetch = Math.min(totalInputs, 6);
    for (let i = 2; i <= maxFetch; i++) {
      const vUrl = buildVariantUrl(cleanUrl, i);
      const controller = new AbortController();
      const tId = setTimeout(() => controller.abort(), 5000);
      fetchPromises.push(
        fetch(vUrl, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          },
          cache: 'no-store',
        })
          .then(res => { clearTimeout(tId); return res.ok ? res.text() : null; })
          .catch(() => { clearTimeout(tId); return null; })
      );
    }

    const fetchedVariantHtmls = await Promise.all(fetchPromises);
    for (const vHtml of fetchedVariantHtmls) {
      if (vHtml && vHtml.includes('<table')) {
        sectionPages.push(vHtml);
      }
    }
  }

  // Parse each section page
  const sections = [];
  let totalQuestions = 0, attempted = 0, correct = 0, wrong = 0, unattempted = 0;

  sectionPages.forEach((pageHtml, idx) => {
    const parsedSec = parseSingleSectionPage(pageHtml, idx + 1, marksRight, marksWrong);
    if (parsedSec.totalQuestions > 0 || sectionPages.length === 1) {
      sections.push(parsedSec.section);
      totalQuestions += parsedSec.totalQuestions;
      attempted += parsedSec.attempted;
      correct += parsedSec.correct;
      wrong += parsedSec.wrong;
      unattempted += parsedSec.unattempted;
    }
  });

  const rawScore = parseFloat(((correct * marksRight) - (wrong * marksWrong)).toFixed(2));
  const maxPossible = totalQuestions * marksRight;
  const percentage = maxPossible > 0 ? Math.min(100, Math.max(0, (rawScore / maxPossible) * 100)) : 0;
  const normalizedScore = parseFloat((rawScore * 1.065 + 1.25).toFixed(2));
  const percentile = parseFloat((85 + (percentage * 0.145)).toFixed(2));
  const estimatedTotal = 45000 + (totalQuestions * 500);
  const overallRank = Math.max(1, Math.round(estimatedTotal * (1 - percentile / 100)));
  const categoryRank = Math.max(1, Math.round(overallRank * 0.28));

  return {
    ...candidateInfo,
    totalQuestions,
    attempted,
    correct,
    wrong,
    unattempted,
    marksRight,
    marksWrong,
    rawScore,
    normalizedScore,
    percentile,
    overallRank,
    categoryRank,
    totalCandidates: estimatedTotal,
    sections: sections.length > 0 ? sections : [
      { name: 'Full Exam', total: totalQuestions, attempted, correct, wrong, unattempted, rawScore }
    ],
    provider: 'cbexams',
  };
}
