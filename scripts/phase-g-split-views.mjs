/**
 * Split client/views/ViewRouter.tsx into per-view files + ViewOverlays.tsx.
 * Prerequisite: full ViewRouter from LegacyApp (node scripts/phase-g-fix.mjs).
 * Run: node scripts/phase-g-split-views.mjs
 */
import fs from 'fs';
import path from 'path';

const routerPath = 'client/views/ViewRouter.tsx';
const src = fs.readFileSync(routerPath, 'utf8');
const lines = src.split('\n');

if (lines.length < 1000) {
  throw new Error('ViewRouter looks already split; run node scripts/phase-g-fix.mjs first');
}

const importEnd = lines.findIndex((l) => l.startsWith('import { useApp }'));
const sharedImports = lines.slice(0, importEnd).join('\n');

const destructureMatch = src.match(/const \{[\s\S]*?\} = useApp\(\);/);
if (!destructureMatch) throw new Error('useApp destructure not found');
const destructure = destructureMatch[0];

const COMPONENT_NAMES = {
  IM: 'ImView',
  RECHARGE: 'RechargeRouteView',
  WALLET: 'WalletRouteView',
};

function toComponentName(viewKey) {
  if (COMPONENT_NAMES[viewKey]) return COMPONENT_NAMES[viewKey];
  const parts = viewKey.toLowerCase().split('_');
  return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('') + 'View';
}

/** Inclusive 1-based line slice */
const sliceLines = (start, endInclusive) => lines.slice(start - 1, endInclusive);

const viewStarts = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (!/^\s+\{currentView === '/.test(line)) continue;
  if (!line.includes('&& (')) continue;
  const m = line.match(/currentView === '([^']+)'/);
  if (!m) continue;
  viewStarts.push([m[1], toComponentName(m[1]), i + 1]);
}

const unfollowIdx = lines.findIndex((l) => l.includes('Unfollow Confirmation Modal'));
if (unfollowIdx < 0) throw new Error('Unfollow modal marker not found');

let modeWaitClose = unfollowIdx - 1;
while (modeWaitClose > 0 && lines[modeWaitClose].trim() === '') modeWaitClose -= 1;
if (lines[modeWaitClose].trim() !== '</AnimatePresence>') {
  throw new Error(`mode="wait" close not found (got: ${lines[modeWaitClose]})`);
}

/** Trailing sibling blocks inside mode="wait" (inclusive 1-based ranges). */
const trailingByView = {
  APPLY_PLAYER: [3429, 3497],
};

const views = viewStarts.map(([viewKey, componentName, start], idx) => {
  let endInclusive;
  if (trailingByView[viewKey]) {
    endInclusive = trailingByView[viewKey][0] - 1;
  } else if (idx + 1 < viewStarts.length) {
    endInclusive = viewStarts[idx + 1][2] - 1;
  } else {
    // Last route block ends at `)}` on the line before mode="wait" </AnimatePresence>
    endInclusive = modeWaitClose;
  }
  while (endInclusive >= start && lines[endInclusive - 1].trim() === '') endInclusive -= 1;
  return [viewKey, componentName, start, endInclusive];
});

const stripConditional = (blockLines, viewKey) => {
  const first = blockLines[0].trim();
  if (!first.includes(`currentView === '${viewKey}'`)) {
    throw new Error(`Unexpected first line for ${viewKey}: ${first}`);
  }
  let lastIdx = blockLines.length - 1;
  while (blockLines[lastIdx].trim() === '') lastIdx -= 1;
  if (blockLines[lastIdx].trim() !== ')}') {
    throw new Error(`Unexpected last line for ${viewKey}: ${JSON.stringify(blockLines[lastIdx])}`);
  }
  return blockLines.slice(1, lastIdx);
};

const viewsDir = 'client/views';

for (const [viewKey, componentName, start, endInclusive] of views) {
  const block = sliceLines(start, endInclusive);
  let bodyLines = stripConditional(block, viewKey);
  const trailing = trailingByView[viewKey];
  if (trailing) {
    const [tStart, tEnd] = trailing;
    bodyLines = [...bodyLines, ...sliceLines(tStart, tEnd)];
  }
  const inner = bodyLines.join('\n');
  const body = trailing ? `    <>\n${inner}\n    </>` : inner;
  const file = `${sharedImports}
import { useApp } from '../app/AppContext';

export function ${componentName}() {
${destructure}

  return (
${body}
  );
}
`;
  fs.writeFileSync(path.join(viewsDir, `${componentName}.tsx`), file);
  console.log('wrote', componentName);
}

let overlayEndLine = -1;
for (let i = lines.length - 1; i > unfollowIdx; i -= 1) {
  if (lines[i].trim() === '</AnimatePresence>') {
    overlayEndLine = i + 1;
    break;
  }
}
if (overlayEndLine < 0) throw new Error('ViewOverlays end </AnimatePresence> not found');

const overlayBody = sliceLines(unfollowIdx + 1, overlayEndLine).join('\n');
fs.writeFileSync(
  path.join(viewsDir, 'ViewOverlays.tsx'),
  `${sharedImports}
import { useApp } from '../app/AppContext';

export function ViewOverlays() {
${destructure}

  return (
    <>
${overlayBody}
    </>
  );
}
`
);
console.log('wrote ViewOverlays.tsx');

const imports = views.map(([, name]) => `import { ${name} } from './${name}';`).join('\n');

const gatedRoutes = views
  .map(([key, name, start]) => {
    const condLine = lines[start - 1].trim();
    const m = condLine.match(/^\{(.+?) && \($/);
    const condition = m ? m[1] : `currentView === '${key}'`;
    return `          {${condition} && <ViewGate><${name} /></ViewGate>}`;
  })
  .join('\n');

const newRouter = `import type { ReactNode } from 'react';
import { AnimatePresence } from 'motion/react';
import { useApp } from '../app/AppContext';
import { ErrorBoundary } from '../lib/errorBoundary';
import { ViewOverlays } from './ViewOverlays';
${imports}

function ViewGate({ children }: { children: ReactNode }) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}

export function ViewRouter() {
  const { currentView, selectedPost, selectedEPal, selectedVariant } = useApp();

  return (
    <>
      <AnimatePresence mode="wait">
${gatedRoutes}
      </AnimatePresence>
      <ViewOverlays />
    </>
  );
}
`;

fs.writeFileSync(routerPath, newRouter);
console.log('wrote ViewRouter.tsx', newRouter.split('\n').length, 'lines');
