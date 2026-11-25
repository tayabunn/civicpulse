const https = require('https');
const fs = require('fs');

async function testFetch(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve({ url, status: res.statusCode, type: res.headers['content-type'] });
    }).on('error', (e) => resolve({ url, error: e.message }));
  });
}

async function run() {
  const urls = [
    'https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/Twitter.svg',
    'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/x.svg',
    'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/github.svg',
    'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/linkedin.svg',
    'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/youtube.svg',
  ];
  for (const u of urls) {
    console.log(await testFetch(u));
  }
}
run();
