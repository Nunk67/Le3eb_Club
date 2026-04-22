const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const keyRegex = /key=["']([^"']+)["']/g;
let match;
const keys = new Map();
while ((match = keyRegex.exec(content)) !== null) {
  const key = match[1];
  const line = content.substring(0, match.index).split('\n').length;
  if (keys.has(key)) {
    console.log(`Duplicate key "${key}" found at line ${line} (first seen at line ${keys.get(key)})`);
  } else {
    keys.set(key, line);
  }
}
