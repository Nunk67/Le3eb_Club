
const fs = require('fs');
const content = fs.readFileSync('src/constants.ts', 'utf8');

const idRegex = /id:\s*['"]([^'"]+)['"]/g;
const ids = [];
let match;

while ((match = idRegex.exec(content)) !== null) {
  ids.push(match[1]);
}

const duplicates = ids.filter((item, index) => ids.indexOf(item) !== index);

if (duplicates.length > 0) {
  console.log('Duplicate IDs found:', [...new Set(duplicates)]);
} else {
  console.log('No duplicate IDs found in constants.ts');
}
