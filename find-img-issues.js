const fs = require('fs');
const c = fs.readFileSync('index.html', 'utf8');

const imgs = c.match(/<img[^\u003e]*>/g) || [];
console.log(`Gefundene Bilder: ${imgs.length}\n`);
imgs.forEach((img, i) => {
  const hasWidth = img.includes('width=');
  const hasHeight = img.includes('height=');
  const hasAlt = img.includes('alt=');
  if (!hasWidth || !hasHeight || !hasAlt) {
    console.log(`${i + 1}. ${img.substring(0, 100)}${img.length > 100 ? '...' : ''}`);
    console.log(`   width: ${hasWidth ? '✅' : '❌'}, height: ${hasHeight ? '✅' : '❌'}, alt: ${hasAlt ? '✅' : '❌'}\n`);
  }
});
