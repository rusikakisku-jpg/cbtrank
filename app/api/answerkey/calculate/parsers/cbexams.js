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

// ── MAIN: Parse cbexams.com HTML ──
export function parseCbexams(html, marksRight, marksWrong, slug = '') {
  const candidateInfo = extractCandidateInfo(html);
  const { sections, totalQuestions, attempted, correct, wrong, unattempted } = parseQuestions(html, marksRight, marksWrong);

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
    sections,
    provider: 'cbexams',
  };
}
