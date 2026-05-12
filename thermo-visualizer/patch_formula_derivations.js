const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'js', 'app.js');
const bodyPath = path.join(__dirname, '_formula_derivations_body.txt');

let s = fs.readFileSync(appPath, 'utf8').replace(/\r\n/g, '\n');
const body = fs.readFileSync(bodyPath, 'utf8').replace(/\r\n/g, '\n');

const start = "    'formula-derivations': `\n";
const i = s.indexOf(start);
const third_tag = "\n    'third-law': `";
const third_start = s.indexOf(third_tag, i);

if (i < 0 || third_start < 0) {
    console.error('markers not found', { i, third_start });
    process.exit(1);
}

const escaped = body.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
const neo = start + escaped + '\n    `,';

fs.writeFileSync(appPath, s.slice(0, i) + neo + s.slice(third_start));
console.log('formula-derivations patched');
