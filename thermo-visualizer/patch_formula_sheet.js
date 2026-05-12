const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'js', 'app.js');
const bodyPath = path.join(__dirname, '_formula_sheet_body.txt');

let s = fs.readFileSync(appPath, 'utf8').replace(/\r\n/g, '\n');
const body = fs.readFileSync(bodyPath, 'utf8').replace(/\r\n/g, '\n');

const start = "    'formula-sheet': `\n";
const i = s.indexOf(start);
const next_tag = "\n    'ai-tutor': `";
const next_start = s.indexOf(next_tag, i);

if (i < 0 || next_start < 0) {
    console.error('formula-sheet markers not found', { i, next_start });
    process.exit(1);
}

const escaped = body.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
const neo = start + escaped + '\n    `,';

fs.writeFileSync(appPath, s.slice(0, i) + neo + s.slice(next_start));
console.log('formula-sheet patched');
