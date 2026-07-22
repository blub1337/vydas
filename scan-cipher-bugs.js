/**
 * SCAN CIPHER LANDING PAGE - Deep Bug Scan
 * Für landing-page-cipher/index.html
 */

const fs = require('fs');
const http = require('http');

const BASE_URL = process.env.BASE_URL || 'http://localhost:8081';

function checkFile() {
  const content = fs.readFileSync('index.html', 'utf8');
  const issues = [];

  // 1. Encoding checks
  const mojibake = content.match(/[\xC0-\xFF]/g) || [];
  if (mojibake.length > 0) {
    issues.push({ severity: 'HIGH', type: 'encoding', msg: `${mojibake.length} Mojibake-Bytes gefunden` });
  }

  // 2. Empty links
  const emptyLinks = (content.match(/href=["']#["']/g) || []).length;
  if (emptyLinks > 5) {
    issues.push({ severity: 'LOW', type: 'ux', msg: `${emptyLinks} leere Links (href="#")` });
  }

  // 3. Missing alt attributes on images
  const imgTags = content.match(/<img[^\u003e]*>/g) || [];
  const missingAlt = imgTags.filter(tag => !tag.includes('alt=')).length;
  if (missingAlt > 0) {
    issues.push({ severity: 'MEDIUM', type: 'a11y', msg: `${missingAlt} Bilder ohne alt-Attribut` });
  }

  // 4. External links without rel attributes
  const extLinks = content.match(/href="https?:\/\/[^"]*"/g) || [];
  let missingRel = 0;
  extLinks.forEach(link => {
    const idx = content.indexOf(link);
    const start = content.lastIndexOf('<', idx);
    const end = content.indexOf('>', idx);
    const tag = content.substring(start, end + 1);
    if (!tag.includes('rel=') && !link.includes('fonts.googleapis') && !link.includes('cdnjs.cloudflare') && !tag.includes('rel=')) {
      missingRel++;
    }
  });
  if (missingRel > 0) {
    issues.push({ severity: 'LOW', type: 'seo', msg: `${missingRel} externe Links ohne rel-Attribut` });
  }

  // 5. Inline scripts/styles size
  const inlineStyles = content.match(/<style[^\u003e]*>([\s\S]*?)<\/style>/g) || [];
  const inlineScripts = content.match(/<script[^\u003e]*>([\s\S]*?)<\/script>/g) || [];
  const cssSize = inlineStyles.reduce((sum, s) => sum + s.length, 0);
  const jsSize = inlineScripts.reduce((sum, s) => sum + s.length, 0);
  if (cssSize > 50000) {
    issues.push({ severity: 'MEDIUM', type: 'performance', msg: `Inline CSS ist ${(cssSize/1024).toFixed(1)}KB groß` });
  }
  if (jsSize > 20000) {
    issues.push({ severity: 'MEDIUM', type: 'performance', msg: `Inline JS ist ${(jsSize/1024).toFixed(1)}KB groß` });
  }

  // 6. Images without width/height (CLS risk)
  const imgsWithoutDims = imgTags.filter(tag => !tag.includes('width=') || !tag.includes('height=')).length;
  if (imgsWithoutDims > 0) {
    issues.push({ severity: 'MEDIUM', type: 'performance', msg: `${imgsWithoutDims} Bilder ohne width/height (CLS-Risiko)` });
  }

  // 7. Large image URLs (unoptimized)
  const largeImgs = (content.match(/pexels[^"]*\?(?:auto=compress)?[^"]*w=(?:1000|1200|1500|2000)/g) || []);
  if (largeImgs.length > 0) {
    issues.push({ severity: 'LOW', type: 'performance', msg: `${largeImgs.length} große Pexels-Bilder` });
  }

  // 8. Duplicate IDs
  const ids = content.match(/id=["']([^"']+)["']/g) || [];
  const idValues = ids.map(id => id.replace(/id=["']/, '').replace(/["']$/, ''));
  const duplicates = idValues.filter((item, index) => idValues.indexOf(item) !== index);
  const uniqueDups = [...new Set(duplicates)];
  if (uniqueDups.length > 0) {
    issues.push({ severity: 'HIGH', type: 'html', msg: `Doppelte IDs: ${uniqueDups.join(', ')}` });
  }

  // 9. Form without proper action/method
  if (content.includes('<form') && !content.includes('form.action')) {
    issues.push({ severity: 'LOW', type: 'ux', msg: 'Formular ohne sichtbare Submission-Logik' });
  }

  // 10. Missing Open Graph / Twitter cards
  if (!content.includes('og:')) {
    issues.push({ severity: 'MEDIUM', type: 'seo', msg: 'Keine Open Graph Meta Tags' });
  }

  return { issues, stats: { cssSize, jsSize, imgCount: imgTags.length, linkCount: extLinks.length } };
}

async function checkLive() {
  return new Promise((resolve, reject) => {
    http.get(BASE_URL, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          size: data.length,
          hasGreek: /[\u0370-\u03FF]/.test(data),
          hasVydas: data.includes('VYDAS.NET')
        });
      });
    }).on('error', reject);
  });
}

async function main() {
  const fileResult = checkFile();
  const liveResult = await checkLive();

  console.log('🔍 CIPHER LANDING PAGE SCAN\n');
  console.log('Live Check:', liveResult.status === 200 ? '✅ OK' : '❌ FAIL');
  console.log('  Status:', liveResult.status);
  console.log('  Size:', liveResult.size, 'bytes');
  console.log('  Greek:', liveResult.hasGreek ? '✅' : '❌');
  console.log('  VYDAS:', liveResult.hasVydas ? '✅' : '❌');
  console.log('\nStats:');
  console.log('  Inline CSS:', (fileResult.stats.cssSize / 1024).toFixed(1), 'KB');
  console.log('  Inline JS:', (fileResult.stats.jsSize / 1024).toFixed(1), 'KB');
  console.log('  Images:', fileResult.stats.imgCount);
  console.log('  Links:', fileResult.stats.linkCount);

  if (fileResult.issues.length === 0) {
    console.log('\n✅ KEINE BUGS GEFUNDEN!');
    process.exit(0);
  }

  console.log(`\n⚠️  ${fileResult.issues.length} ISSUES GEFUNDEN:\n`);
  fileResult.issues.forEach((issue, i) => {
    console.log(`${i + 1}. [${issue.severity}] ${issue.type.toUpperCase()}`);
    console.log(`   ${issue.msg}\n`);
  });

  fs.writeFileSync('CIPHER_BUGS.json', JSON.stringify(fileResult.issues, null, 2));
  process.exit(1);
}

main().catch(err => {
  console.error('FATAL:', err.message);
  process.exit(1);
});
