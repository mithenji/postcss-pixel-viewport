const { readFileSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');

const cjsFile = join(__dirname, '..', 'dist', 'index.cjs');
const content = readFileSync(cjsFile, 'utf8');

if (!content.includes('postcss-pixel-viewport cjs compatibility wrapper')) {
  writeFileSync(
    cjsFile,
    `${content}

// postcss-pixel-viewport cjs compatibility wrapper
if (module.exports && module.exports.default) {
  module.exports = Object.assign(module.exports.default, module.exports);
  module.exports.default = module.exports;
}
`
  );
}
