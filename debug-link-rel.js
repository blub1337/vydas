const fs = require('fs');
const c = fs.readFileSync('index.html', 'utf8');

// Findet alle hrefs
const allHrefs = c.match(/href="[^"]*"/g) || [];
console.log('Alle hrefs:', allHrefs.length);
allHrefs.forEach((href, i) => {
  const fullTagStart = c.lastIndexOf('<', c.indexOf(href));
  const fullTagEnd = c.indexOf('>', c.indexOf(href));
  const tag = c.substring(fullTagStart, fullTagEnd + 1);
  if (href.includes('http') && !href.includes('fonts.googleapis') && !href.includes('cdnjs.cloudflare')) {
    console.log(`${i + 1}. ${tag}`);
  }
});
