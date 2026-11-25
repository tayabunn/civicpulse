const sharp = require('sharp');
const fs = require('fs');

const blueLogoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 304 304" width="128" height="128">
  <path d="M 0,0 L 213,0 L 304,91 L 304,155 L 241,155 L 171,85 L 85,85 L 85,213 L 0,213 Z" fill="#305dff" />
  <path d="M 86,214 L 304,214 L 304,304 L 86,304 Z" fill="#305dff" />
</svg>`;

const whiteLogoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 304 304" width="128" height="128">
  <path d="M 0,0 L 213,0 L 304,91 L 304,155 L 241,155 L 171,85 L 85,85 L 85,213 L 0,213 Z" fill="#ffffff" />
  <path d="M 86,214 L 304,214 L 304,304 L 86,304 Z" fill="#ffffff" />
</svg>`;

async function run() {
  const realBlueLogo = (await sharp(Buffer.from(blueLogoSvg)).png().toBuffer()).toString('base64');
  const realWhiteLogo = (await sharp(Buffer.from(whiteLogoSvg)).png().toBuffer()).toString('base64');

  const existing = JSON.parse(fs.readFileSync('./backend/src/emails/ledger/assets.json', 'utf8'));
  existing.realBlueLogo = realBlueLogo;
  existing.realWhiteLogo = realWhiteLogo;
  fs.writeFileSync('./backend/src/emails/ledger/assets.json', JSON.stringify(existing, null, 2));
  console.log('REAL LOGOS CONVERTED SUCCESSFULLY');
}
run();
