
const fs = require('fs');
const files = ['src/App.tsx', 'src/components/ReviewModules.tsx', 'src/constants.ts'];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, i) => {
    if (line.includes('.map(') && line.includes('key={')) {
      console.log(`${file}:${i + 1}: ${line.trim()}`);
    } else if (line.includes('key={')) {
       // Also check keys not directly on .map line (often next line)
       console.log(`${file}:${i + 1}: ${line.trim()}`);
    }
  });
});
