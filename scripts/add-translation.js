const fs = require('fs');
const { langs, rtlLangs } = require('./langs');

const lang = process.argv[2];
const isRtl = process.argv[3];

if (!lang) {
  throw new Error(
    'Please specify language code like so: npm run translation:add it',
  );
}

if (langs.includes(lang)) {
  throw new Error('Such language already exists');
}

langs.push(lang);
if (isRtl === 'true') {
  rtlLangs.push(lang);
}
fs.writeFileSync(
  './scripts/langs.js',
  `module.exports = {
    langs: [${langs.map((l) => `'${l}'`)}],
    rtlLangs: [${rtlLangs.map((l) => `'${l}'`)}],
  };`,
);
fs.writeFileSync(
  './src/langs.ts',
  `export const supportedLangs = [${langs.map((l) => `'${l}'`)}];`,
);

require('./generate-translations');
