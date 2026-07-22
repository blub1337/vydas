const fs = require('fs');

let c = fs.readFileSync('index.html', 'utf8');

// Füge width/height zu allen port-card-img Bildern hinzu
const regex = /<img class="port-card-img" src="([^"]+)" alt="([^"]+)" loading="lazy">/g;

let count = 0;
c = c.replace(regex, (match, src, alt) => {
  count++;
  return `<img class="port-card-img" src="${src}" alt="${alt}" width="400" height="200" loading="lazy" decoding="async">`;
});

fs.writeFileSync('index.html', c, 'utf8');
console.log(`✅ ${count} Bilder mit width/height versehen`);
