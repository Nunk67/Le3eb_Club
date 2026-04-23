
const fs = require('fs');

const content = fs.readFileSync('/app/applet/src/App.tsx', 'utf8');
const lines = content.split('\n');

const keyRegex = /key={([^}]+)}/g;
let match;
const keysInFiles = [];

for (let i = 0; i < lines.length; i++) {
  while ((match = keyRegex.exec(lines[i])) !== null) {
    keysInFiles.push({ key: match[1], line: i + 1 });
  }
}

// Group by line to see duplicates in siblings (hard to automate perfectly but let's see common keys)
const commonKeys = ['star', 'idx', 'id', 'i', 'index', 'item', 'game.id', 'epal.id', 'tab.id', 'pkg.id', 'notif.id', 'tx.id', 'order.id'];

keysInFiles.forEach(k => {
    if (!commonKeys.includes(k.key) && !k.key.includes('`') && !k.key.includes('$')) {
        // console.log(`Suspicious potential hardcoded key: ${k.key} at line ${k.line}`);
    }
});

// Check constants for actual data duplicates
const constantsContent = fs.readFileSync('/app/applet/src/constants.ts', 'utf8');
const idRegex = /id:\s*['"]([^'"]+)['"]/g;
const ids = {};
while ((match = idRegex.exec(constantsContent)) !== null) {
  const id = match[1];
  ids[id] = (ids[id] || 0) + 1;
}

Object.keys(ids).forEach(id => {
  if (ids[id] > 1) {
    console.log(`Duplicate ID in constants.ts: ${id} (found ${ids[id]} times)`);
  }
});

const serverContent = fs.readFileSync('/app/applet/server.ts', 'utf8');
const serverIds = {};
while ((match = idRegex.exec(serverContent)) !== null) {
  const id = match[1];
  serverIds[id] = (serverIds[id] || 0) + 1;
}

Object.keys(serverIds).forEach(id => {
  if (serverIds[id] > 1) {
    console.log(`Duplicate ID in server.ts: ${id} (found ${serverIds[id]} times)`);
  }
});
