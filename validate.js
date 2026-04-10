#!/usr/bin/env node
/**
 * LessonLab Content Validator
 * Run: node validate.js
 * Exit 0 = all clear, Exit 1 = errors found
 *
 * Checks:
 *  1. JavaScript syntax
 *  2. Cross-subject equipment contamination
 *  3. TBD / placeholder content
 *  4. HTML div balance
 *  5. Very short or empty lesson fields
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'index.html');
const content = fs.readFileSync(FILE, 'utf8');
const lines = content.split('\n');

let errorCount = 0;
let warnCount  = 0;

function error(msg) { console.error(`  ❌ ERROR: ${msg}`); errorCount++; }
function warn(msg)  { console.warn( `  ⚠️  WARN:  ${msg}`); warnCount++;  }
function ok(msg)    { console.log(  `  ✅ OK:    ${msg}`); }

// ─────────────────────────────────────────────────────────────────────────────
// 1. JAVASCRIPT SYNTAX
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n── 1. JavaScript Syntax ─────────────────────────────────────');
const os = require('os');
const { execSync } = require('child_process');
const scriptBlocks = [...content.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
const js = scriptBlocks.join('\n');
// Strip base64 logo data (too large for parser, not logic)
const jsForCheck = js.replace(/let logoData = 'data:image[^']{100,}';/, "let logoData = 'x';");
const tmpFile = path.join(os.tmpdir(), 'lessonlab_validate.cjs');
fs.writeFileSync(tmpFile, jsForCheck);
try {
  execSync(`node --check "${tmpFile}"`, { stdio: 'pipe' });
  ok(`JS syntax clean (${(js.length/1024).toFixed(0)} KB across ${scriptBlocks.length} script blocks)`);
} catch (e) {
  const msg = (e.stderr || e.stdout || '').toString().split('\n').slice(0,4).join(' ');
  error(`JS syntax error: ${msg}`);
} finally {
  try { fs.unlinkSync(tmpFile); } catch(_) {}
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. CROSS-SUBJECT EQUIPMENT CONTAMINATION
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n── 2. Equipment Cross-Contamination ─────────────────────────');

// Subject line ranges (1-indexed, inclusive) — covers data declarations AND inline week blocks
// Each subject can have MULTIPLE ranges (data decl block + inline weeks block)
const SUBJECT_RANGES_MULTI = {
  'pe':           [[3023, 3106],  [3648, 3726]],
  'science':      [[3107, 3262],  [3918, 3986], [4598, 4699]],
  'visual-art':   [[3263, 3346],  [3727, 3806]],
  'music':        [[3347, 3394],  [4045, 4094]],
  'drama':        [[3395, 3442],  [4095, 4145]],
  'digital_tech': [[3443, 3562],  [3987, 4044]],
  'french':       [[3563, 3647],  [3807, 3917]],
  'numeracy':     [[4146, 4412]],
  'literacy':     [[4413, 4597]],
};

// Flatten to a lookup function
function getSubject(lineno) {
  for (const [subj, ranges] of Object.entries(SUBJECT_RANGES_MULTI)) {
    for (const [start, end] of ranges) {
      if (lineno >= start && lineno <= end) return subj;
    }
  }
  return null;
}
// Keep backward compat alias
const SUBJECT_RANGES = {}; // unused but left for clarity

// Fingerprints unique to a subject's equipment — if found in another subject, it's a bug
// Format: { fingerprint_string: 'owner_subject' }
const EQ_FINGERPRINTS = {
  // French
  'Pronunciation file playback':     'french',
  'Native speaker audio:':           'french',
  'Sentence strips: Structure cards':'french',
  'Family tree template':            'french',
  // Music
  'Notation cards: Visual rhythm':   'music',
  'Rhythm instruments:':             'music',
  'Boomwhackers':                    'music',
  'Glockenspiel':                    'music',
  'Xylophones:':                     'music',
  // PE
  'Bibs:':                           'pe',
  'Goal posts':                      'pe',
  'Racquets:':                       'pe',
  'Portable net':                    'pe',     // catches net-wall PE eq in wrong subject
  // Visual Art
  'Watercolour paints:':             'visual-art',
  'Acrylic paints:':                 'visual-art',
  'Mixing palettes:':                'visual-art',
  'Paintbrushes:':                   'visual-art',
  'Clay:':                           'visual-art',
  'Art smocks':                      'visual-art',
  // Drama
  'Hot-seating':                     'drama',
  'Costume pieces:':                 'drama',
  // Science
  'Safety goggles:':                 'science',
  'Tuning forks:':                   'science',
  'Iron filings:':                   'science',
  'Prisms:':                         'science',
  'Planet models:':                  'science',
  'Star chart:':                     'science',
  // Digital Tech
  'Scratch:':                        'digital_tech',
  'Micro:bit':                       'digital_tech',
  'Python IDE':                      'digital_tech',
  'Thonny':                          'digital_tech',
  // Numeracy
  'MAB blocks:':                     'numeracy',
  'Fraction bars:':                  'numeracy',
  'Base-10 blocks:':                 'numeracy',
  'Place value chart':               'numeracy',
  // Literacy
  'Phonics cards:':                  'literacy',
  'Decodable readers:':              'literacy',
  'Letter tiles:':                   'literacy',
};

// Allowlist: subject that may legitimately borrow from another
// Format: [host_subject, fp_owner_subject, reason]
const ALLOWLIST = [
  ['french', 'numeracy', 'French number lessons may use manipulatives'],
  ['drama',  'literacy', 'Drama may reference texts'],
];

function isAllowed(hostSubj, fpSubj) {
  return ALLOWLIST.some(([h, f]) => h === hostSubj && f === fpSubj);
}

let eqErrors = 0;
lines.forEach((line, idx) => {
  const lineno = idx + 1;
  const eqMatch = line.match(/eq:'([^']*)'/);
  if (!eqMatch) return;
  const eqVal = eqMatch[1];

  // Determine host subject
  const hostSubj = getSubject(lineno);
  if (!hostSubj) return;

  // Check fingerprints
  for (const [fp, fpSubj] of Object.entries(EQ_FINGERPRINTS)) {
    if (eqVal.includes(fp) && fpSubj !== hostSubj && !isAllowed(hostSubj, fpSubj)) {
      const titleMatch = line.match(/t:'([^']+)'/);
      const title = titleMatch ? titleMatch[1] : '?';
      error(`Line ${lineno} [${hostSubj}] "${title}": has ${fpSubj} equipment ("${fp}")`);
      eqErrors++;
    }
  }
});

if (eqErrors === 0) ok('No cross-subject equipment contamination found');

// ─────────────────────────────────────────────────────────────────────────────
// 3. TBD / PLACEHOLDER CONTENT
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n── 3. TBD / Placeholder Content ─────────────────────────────');

const tbdMatches = [...content.matchAll(/\bTBD\b/g)];
// Ignore TBD inside comments or non-lesson contexts
const tbdInEq = tbdMatches.filter(m => {
  const lineStart = content.lastIndexOf('\n', m.index);
  const lineText = content.slice(lineStart, m.index + 10);
  return lineText.includes("eq:'") || lineText.includes("li:'") || lineText.includes("t:'");
});
if (tbdInEq.length > 0) {
  error(`${tbdInEq.length} TBD placeholder(s) found in lesson content`);
} else {
  ok('No TBD placeholders in lesson content');
}

// Generic placeholder patterns
const genericPatterns = [
  /eq:'Materials: TBD/,
  /eq:'Equipment: As needed/,
  /li:'TBD/,
  /t:'Lesson \d+'/,
  /t:'Week \d+ Lesson'/,
];
let genericCount = 0;
genericPatterns.forEach(pat => {
  const count = (content.match(new RegExp(pat.source, 'g')) || []).length;
  genericCount += count;
  if (count > 0) error(`Generic placeholder pattern found: ${pat.source} (${count} occurrences)`);
});
if (genericCount === 0) ok('No generic lesson placeholder patterns found');

// ─────────────────────────────────────────────────────────────────────────────
// 4. HTML DIV BALANCE
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n── 4. HTML Structure ────────────────────────────────────────');

const opens  = (content.match(/<div[\s>]/g)  || []).length;
const closes = (content.match(/<\/div>/g)    || []).length;
if (opens !== closes) {
  error(`Div mismatch: ${opens} opens vs ${closes} closes (diff: ${opens - closes})`);
} else {
  ok(`Div balance: ${opens} opens = ${closes} closes`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. SHORT / EMPTY LESSON FIELDS
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n── 5. Lesson Field Quality ──────────────────────────────────');

// Empty eq fields
const emptyEq = (content.match(/eq:''/g) || []).length;
if (emptyEq > 0) error(`${emptyEq} lessons have empty eq: field`);
else ok('No empty eq fields');

// Very short learning intentions (under 12 chars including apostrophe padding)
const shortLi = [...content.matchAll(/li:'([^']{1,11})'/g)];
if (shortLi.length > 0) {
  shortLi.forEach(m => error(`Very short li (${m[1].length} chars): "${m[1]}"`));
} else {
  ok('All learning intentions have reasonable length');
}

// SC arrays that are completely empty
const emptySc = (content.match(/sc:\[\]/g) || []).length;
if (emptySc > 0) error(`${emptySc} lessons have empty sc:[] arrays`);
else ok('No empty sc arrays');

// Backtick total balance (catches unclosed template literals)
const btCount = (content.match(/`/g) || []).length;
if (btCount % 2 !== 0) {
  error(`Odd number of backticks (${btCount}) — possible unclosed template literal`);
} else {
  ok(`Backtick count even: ${btCount}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// SUMMARY
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n══════════════════════════════════════════════════════════════');
if (errorCount === 0 && warnCount === 0) {
  console.log('✅ ALL CHECKS PASSED — LessonLab content is clean.');
} else {
  console.log(`Result: ${errorCount} error(s), ${warnCount} warning(s)`);
  if (errorCount > 0) {
    console.error('❌ VALIDATION FAILED');
    process.exit(1);
  }
}
