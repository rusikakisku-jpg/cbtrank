/**
 * digialm.js — Dedicated parser for digialm.com response sheets
 * Ported from digialm.php (PHP original)
 *
 * Key HTML structure of digialm.com pages:
 *  .main-info-pnl  → candidate info table (name, roll no, date, center, etc.)
 *  .grp-cntnr      → question group container
 *    .section-cntnr  → section within group
 *      .section-lbl    → section label/name
 *      .question-pnl   → individual question panel
 *        "Chosen Option" td → candidate's chosen answer
 *        .rightAns td       → correct answer option (green)
 *        .wrngAns td        → wrong answer option (red)
 */

// ── Normalize whitespace and unicode spaces ──
function normText(t) {
  if (!t) return '';
  return t.replace(/[\u00A0\u200B]/g, ' ').replace(/\s+/g, ' ').trim();
}

// ── Convert chosen option string to 1-based index ──
function chosenToIndex(s) {
  if (!s) return null;
  s = s.trim();
  if (!s || s === '--' || s === '-') return null;
  // A/B/C/D
  if (/^[A-D]$/i.test(s)) return s.toUpperCase().charCodeAt(0) - 64;
  if (/^[A-D][.)\\-]?$/i.test(s)) return s[0].toUpperCase().charCodeAt(0) - 64;
  // numeric
  const numMatch = s.match(/^(\d+)$/);
  if (numMatch) return parseInt(numMatch[1], 10);
  const letterMatch = s.match(/([A-D])/i);
  if (letterMatch) return letterMatch[1].toUpperCase().charCodeAt(0) - 64;
  return null;
}

// ── Helper to scan date & time from rows/text ──
function extractDateTimeFromRows(rows) {
  let foundDate = '';
  let foundTime = '';

  const datePatterns = [
    /\b(\d{4}-\d{2}-\d{2})\b/,
    /\b(\d{1,2}-\d{1,2}-\d{4})\b/,
    /\b(\d{1,2}\/\d{1,2}\/\d{4})\b/,
    /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\b/i
  ];

  const timePattern = /\b\d{1,2}:\d{2}(?:\s*[AaPp][Mm])?(?:\s*(?:-|–|—|to)\s*\d{1,2}:\d{2}(?:\s*[AaPp][Mm])?)?\b/;
  const timePattern2 = /\b\d{1,2}(?::\d{2})?\s*(?:[AaPp][Mm])(?:\s*(?:-|–|—|to)\s*\d{1,2}(?::\d{2})?\s*(?:[AaPp][Mm]))?\b/;

  for (const r of rows) {
    const text = normText(Array.isArray(r) ? r.join(' ') : String(r));
    if (!text) continue;
    const lower = text.toLowerCase();

    if (!foundDate && (lower.includes('date') || lower.includes('exam') || lower.includes('test'))) {
      for (const pat of datePatterns) {
        const m = text.match(pat);
        if (m) { foundDate = m[1]; break; }
      }
    }

    if (!foundTime && (lower.includes('time') || lower.includes('shift') || lower.includes('report'))) {
      const mt = text.match(timePattern) || text.match(timePattern2);
      if (mt) { foundTime = mt[0]; }
    }

    if (foundDate && foundTime) break;
  }

  // Fallback scan across all rows if missing
  if (!foundDate) {
    for (const r of rows) {
      const text = normText(Array.isArray(r) ? r.join(' ') : String(r));
      for (const pat of datePatterns) {
        const m = text.match(pat);
        if (m) { foundDate = m[1]; break; }
      }
      if (foundDate) break;
    }
  }

  if (!foundTime) {
    for (const r of rows) {
      const text = normText(Array.isArray(r) ? r.join(' ') : String(r));
      const mt = text.match(timePattern);
      if (mt) { foundTime = mt[0]; break; }
    }
  }

  return { foundDate, foundTime };
}

// ── Extract candidate info from .main-info-pnl ──
function extractCandidateInfo(html) {
  const info = {
    candidateName: '',
    rollNo: '',
    testCenter: '',
    testDate: '',
    testTime: '',
    headerImgUrl: '',
  };

  // Header image (first img in .main-info-pnl)
  const imgMatch = html.match(/class=['"]\s*main-info-pnl\s*['"][^>]*>[\s\S]*?<img[^>]+src=['"]([^'"]+)['"]/i);
  if (imgMatch) info.headerImgUrl = imgMatch[1];

  // Extract table rows from .main-info-pnl as key-value pairs
  const mainPnlMatch = html.match(/class=['"]\s*main-info-pnl\s*['"][^>]*>([\s\S]*?)<\/(?:div|td)>/i);
  const searchArea = mainPnlMatch ? mainPnlMatch[1] : html;

  const allRowCells = [];
  const rows = [...searchArea.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
  for (const row of rows) {
    const cells = [...row[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)]
      .map(c => normText(c[1].replace(/<[^>]+>/g, ' ')));
    if (cells.length >= 2) {
      allRowCells.push(cells);
      const label = cells[0].toLowerCase();
      const value = cells[1];
      if (label.includes('candidate name') || label.includes('participant name') || label.includes('student name')) {
        info.candidateName = value;
      } else if (label.includes('roll number') || label.includes('roll no') || label.includes('participant id') || label.includes('candidate id')) {
        info.rollNo = value;
      } else if (label.includes('test center') || label.includes('exam center')) {
        info.testCenter = value;
      } else if (label.includes('test date') || label.includes('exam date')) {
        info.testDate = value;
      } else if (label.includes('test time') || label.includes('shift')) {
        info.testTime = value;
      }
    }
  }

  // If date/time not directly extracted from key-value labels, run pattern scanner
  if (!info.testDate || !info.testTime) {
    const { foundDate, foundTime } = extractDateTimeFromRows(allRowCells);
    if (!info.testDate && foundDate) info.testDate = foundDate;
    if (!info.testTime && foundTime) info.testTime = foundTime;
  }

  return info;
}

// ── Parse section-wise questions from .grp-cntnr → .section-cntnr → .question-pnl ──
function parseSections(html, marksRight, marksWrong) {
  const sections = [];
  let totalQuestions = 0, totalAttempted = 0, totalRight = 0, totalWrong = 0;

  // Split by section-cntnr
  const secBlocks = html.split(/class=['"]?\s*section-cntnr\s*['"]?/i);

  for (let si = 1; si < secBlocks.length; si++) {
    const secHtml = secBlocks[si];

    // Section label: try second span inside .section-lbl, then bold span, then full text
    let sectionLabel = `Section ${si}`;
    const lblMatch = secHtml.match(/class=['"]?\s*section-lbl\s*['"]?[^>]*>([\s\S]*?)<\/div>/i);
    if (lblMatch) {
      const spans = [...lblMatch[1].matchAll(/<span[^>]*>([\s\S]*?)<\/span>/gi)];
      if (spans.length >= 2) {
        sectionLabel = normText(spans[1][1].replace(/<[^>]+>/g, ''));
      } else if (spans.length === 1) {
        sectionLabel = normText(spans[0][1].replace(/<[^>]+>/g, ''));
      } else {
        const raw = normText(lblMatch[1].replace(/<[^>]+>/g, ''));
        sectionLabel = raw.replace(/^Section\s*:\s*/i, '').trim() || sectionLabel;
      }
    }

    // Split by question-pnl
    const qBlocks = secHtml.split(/class=['"]?\s*question-pnl\s*['"]?/i).slice(1);
    let secTotal = qBlocks.length;
    let secAttempted = 0, secRight = 0, secWrong = 0;

    for (const qHtml of qBlocks) {
      // ── Chosen option ──
      let chosenRaw = null;
      const chosenMatch = qHtml.match(/[Cc]hosen\s*[Oo]ption\s*[:\t]*<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>/i)
        || qHtml.match(/[Cc]hosen\s*[Oo]ption\s*[:\t]*([1-4A-D])/i);
      if (chosenMatch) {
        const raw = normText(chosenMatch[1].replace(/<[^>]+>/g, ''));
        if (raw && raw !== '--' && raw !== '-' && raw !== 'Not Answered') chosenRaw = raw;
      }
      const chosenIndex = chosenToIndex(chosenRaw);

      // ── Status ──
      let statusNorm = null;
      const statusMatch = qHtml.match(/[Ss]tatus\s*[:\t]*<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>/i);
      if (statusMatch) {
        const st = normText(statusMatch[1].replace(/<[^>]+>/g, '')).toLowerCase();
        if (st.includes('not answered') || st.includes('not attempted')) statusNorm = 'Not Answered';
        else if (st.includes('answered') || st.includes('attempted') || st.includes('marked for review')) statusNorm = 'Answered';
      }
      if (statusNorm === null) {
        statusNorm = chosenIndex !== null ? 'Answered' : 'Not Answered';
      }

      // ── Option rows: look for rightAns / wrngAns CSS classes ──
      const optionMatches = [...qHtml.matchAll(/class=['"]([^'"]*(?:rightAns|wrngAns)[^'"]*)['"][^>]*>([\s\S]*?)<\/td>/gi)];
      
      // Fallback: collect all options numbered 1. 2. 3. 4.
      let optionRows = [];
      if (optionMatches.length > 0) {
        for (const om of optionMatches) {
          optionRows.push({ cls: om[1], text: normText(om[2].replace(/<[^>]+>/g, '')) });
        }
      } else {
        // Numbered option fallback
        const numbered = [...qHtml.matchAll(/class=['"]([^'"]*)['"]\s*>\s*(\d+\.[\s\S]*?)<\/td>/gi)];
        for (const nm of numbered) {
          if (/^\s*\d+\./.test(nm[2])) {
            optionRows.push({ cls: nm[1], text: normText(nm[2].replace(/<[^>]+>/g, '')) });
          }
        }
      }

      // ── Determine Right/Wrong ──
      let result = 'No Choice';
      if (statusNorm === 'Answered' && chosenIndex !== null) {
        if (optionRows.length > 0) {
          if (chosenIndex <= optionRows.length) {
            const opt = optionRows[chosenIndex - 1];
            if (/rightAns/i.test(opt.cls)) { result = 'Right'; secRight++; }
            else if (/wrngAns/i.test(opt.cls)) { result = 'Wrong'; secWrong++; }
            else {
              // find rightAns position
              const rightPos = optionRows.findIndex(o => /rightAns/i.test(o.cls));
              if (rightPos >= 0) {
                result = chosenIndex === rightPos + 1 ? 'Right' : 'Wrong';
                if (result === 'Right') secRight++; else secWrong++;
              } else {
                result = 'Wrong'; secWrong++;
              }
            }
          } else {
            result = 'Wrong'; secWrong++;
          }
        } else {
          result = 'Wrong'; secWrong++;
        }
        secAttempted++;
      }
    } // each question

    const secRawScore = parseFloat(((secRight * marksRight) - (secWrong * marksWrong)).toFixed(2));
    sections.push({
      name: sectionLabel,
      total: secTotal,
      attempted: secAttempted,
      correct: secRight,
      wrong: secWrong,
      unattempted: secTotal - secAttempted,
      rawScore: secRawScore,
    });

    totalQuestions += secTotal;
    totalAttempted += secAttempted;
    totalRight += secRight;
    totalWrong += secWrong;
  }

  return { sections, totalQuestions, totalAttempted, correct: totalRight, wrong: totalWrong };
}

// ── MAIN: Parse digialm.com HTML ──
export function parseDigialm(html, marksRight, marksWrong, slug = '') {
  const candidateInfo = extractCandidateInfo(html);
  const { sections, totalQuestions, totalAttempted, correct, wrong } = parseSections(html, marksRight, marksWrong);

  const unattempted = totalQuestions - totalAttempted;
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
    attempted: totalAttempted,
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
      { name: 'Full Exam', total: totalQuestions, attempted: totalAttempted, correct, wrong, unattempted, rawScore }
    ],
    provider: 'digialm',
  };
}
