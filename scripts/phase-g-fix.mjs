import fs from 'fs';

const legacy = fs.readFileSync('client/LegacyApp.tsx', 'utf8').split('\n');

const lucideImports = legacy.slice(1, 68).join('\n');
const sharedImports = `import React from 'react';
${lucideImports}
import { motion, AnimatePresence } from 'motion/react';
import { Category, Game, EPal, EPalServiceVariant, Coupon, Playlink, Post, Message, ChatSession, IMOrder, Wallet as WalletType, RechargePackage, WalletTransaction, RechargeOrder } from '@shared/types';
import { PRODUCT_SEMVER } from '../constants';
import { GlassCard } from '../components/ui/GlassCard';
import { IconButton } from '../components/ui/IconButton';
import { WaveAnimation } from '../components/ui/WaveAnimation';
import { CoinIcon } from '../components/ui/CoinIcon';
import { EPalCard } from '../components/cards/EPalCard';
import { LegendEPalCard } from '../components/cards/LegendEPalCard';
import { GameGridItem } from '../components/cards/GameGridItem';
import { WalletView } from '../views/WalletView';
import { RechargeView } from '../views/RechargeView';
import { SettingsSubPage } from '../components/SettingsSubPage';
import { formatChatMessageTime } from '../lib/chatTime';
`;

const destructure = fs.readFileSync('client/app/AppShell.tsx', 'utf8')
  .match(/const \{[\s\S]*?\} = useApp\(\);/)?.[0];
if (!destructure) throw new Error('destructure block missing in AppShell.tsx');

// Lines 1633–6737: <AnimatePresence mode="wait"> … </AnimatePresence> (inside <main>)
const viewBody = legacy.slice(1632, 6737).join('\n');
const viewRouter = `${sharedImports}
import { useApp } from '../app/AppContext';

export function ViewRouter() {
${destructure}

  return (
    <>
${viewBody}
    </>
  );
}
`;
fs.writeFileSync('client/views/ViewRouter.tsx', viewRouter);

// Lines 1436–1632: outer shell + header + <main> + search modal
const shellHead = legacy.slice(1435, 1632).join('\n');
// Lines 6738–7293: </main> … overlays … closing outer </motion.div>
const shellTail = legacy.slice(6737, 7293).join('\n');
const nav = legacy.slice(7296).join('\n');

const appShell = `${sharedImports}
import { useApp } from './AppContext';
import { ViewRouter } from '../views/ViewRouter';

export function AppShell() {
${destructure}

  return (
${shellHead}
      <ViewRouter />
${shellTail}
  );
}

${nav}
`;
fs.writeFileSync('client/app/AppShell.tsx', appShell);

console.log('ViewRouter lines:', viewRouter.split('\n').length);
console.log('AppShell lines:', appShell.split('\n').length);
