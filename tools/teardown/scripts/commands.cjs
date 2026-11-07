const fs = require('node:fs'), {execFileSync} = require('node:child_process');

function has(command) {
  try {
    execFileSync(process.platform === 'win32' ? 'where' : 'which', [command], {stdio: 'ignore'});
    return true;
  } catch {
    return false;
  }
}

function findChrome() {
  const candidates = [
    'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    'google-chrome',
    'chromium',
    'chromium-browser'
  ];
  return candidates.find(c => (c.includes('/') || c.includes('\\')) ? fs.existsSync(c) : has(c));
}

module.exports = {has, findChrome};
