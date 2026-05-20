import fs from 'fs';
import path from 'path';

const root = path.resolve('client');
const appRootPath = path.join(root, 'app/AppRoot.tsx');
const lines = fs.readFileSync(appRootPath, 'utf8').split('\n');

const views = [
  ['HomeView', 'HOME', 982, 1139],
  ['CommunitySelectorView', 'COMMUNITY_SELECTOR', 1141, 1186],
  ['CommunityView', 'COMMUNITY', 1188, 1352],
  ['CategoryServicesView', 'CATEGORY_SERVICES', 1354, 1493],
  ['PostDetailView', 'POST_DETAIL', 1495, 1679],
  ['LegendListView', 'LEGEND_LIST', 1681, 1710],
  ['GameDetailView', 'GAME_DETAIL', 1712, 1862],
  ['ProfileView', 'PROFILE', 1864, 2354],
  ['AllReviewsView', 'ALL_REVIEWS', 2356, 2560],
  ['ImView', 'IM', 2562, 2748],
  ['ContactsView', 'CONTACTS', 2750, 2836],
  ['ImDetailView', 'IM_DETAIL', 2838, 3030],
  ['MeView', 'ME', 3032, 3363],
  ['MyOrdersView', 'MY_ORDERS', 3365, 3476],
  ['RechargeRouteView', 'RECHARGE', 3478, 3492],
  ['WithdrawView', 'WITHDRAW', 3494, 3565],
  ['ApplyPlayerView', 'APPLY_PLAYER', 3567, 4338],
  ['ApplyPlayerCategoryView', 'APPLY_PLAYER_CATEGORY', 4340, 4382],
  ['ApplyPlayerDetailsView', 'APPLY_PLAYER_DETAILS', 4384, 4480],
  ['SettingsView', 'SETTINGS', 4482, 4607],
  ['SettingsEditProfileView', 'SETTINGS_EDIT_PROFILE', 4609, 4654],
  ['SettingsChangePasswordView', 'SETTINGS_CHANGE_PASSWORD', 4656, 4704],
  ['SettingsLinkedAccountsView', 'SETTINGS_LINKED_ACCOUNTS', 4706, 4741],
  ['SettingsLanguageView', 'SETTINGS_LANGUAGE', 4743, 4772],
  ['SettingsPrivacyView', 'SETTINGS_PRIVACY', 4774, 4805],
  ['SettingsTermsView', 'SETTINGS_TERMS', 4807, 4838],
  ['WalletRouteView', 'WALLET', 4840, 4856],
  ['PlayerProfileEditView', 'PLAYER_PROFILE_EDIT', 4858, 4945],
  ['NotificationsView', 'NOTIFICATIONS', 4947, 4993],
  ['OrderConfirmView', 'ORDER_CONFIRM', 4995, 5598],
];

const viewsDir = path.join(root, 'views');
fs.mkdirSync(viewsDir, { recursive: true });

const viewFiles = [];
for (const [name, viewKey, start, end] of views) {
  const body = lines.slice(start - 1, end).join('\n');
  const content = `import { useApp } from '../app/AppContext';

export function ${name}() {
  useApp();
  return (
${body}
  );
}
`;
  const file = path.join(viewsDir, `${name}.tsx`);
  fs.writeFileSync(file, content);
  viewFiles.push({ name, viewKey, file: `${name}.tsx` });
}

const routerImports = viewFiles.map(v => `import { ${v.name} } from './${v.name.replace('.tsx', '')}';`).join('\n');
const routerSwitch = viewFiles
  .map(v => `      {currentView === '${v.viewKey}' && <${v.name} />}`)
  .join('\n');

const router = `import { useApp } from '../app/AppContext';
${routerImports}

export function ViewRouter() {
  const { currentView } = useApp();
  return (
    <AnimatePresence mode="wait">
${routerSwitch}
    </AnimatePresence>
  );
}
`;

fs.writeFileSync(path.join(viewsDir, 'ViewRouter.tsx'), router.replace(
  '<AnimatePresence mode="wait">',
  "import { AnimatePresence } from 'motion/react';\n\nexport function ViewRouter() {\n  const { currentView } = useApp();\n  return (\n    <AnimatePresence mode=\"wait\">"
));

// Fix duplicate - rewrite ViewRouter cleanly
const routerContent = `import { AnimatePresence } from 'motion/react';
import { useApp } from '../app/AppContext';
${routerImports}

export function ViewRouter() {
  const { currentView } = useApp();
  return (
    <AnimatePresence mode="wait">
${routerSwitch}
    </AnimatePresence>
  );
}
`;
fs.writeFileSync(path.join(viewsDir, 'ViewRouter.tsx'), routerContent);

// AppShell: head (782-979) + tail (5599-end) with ViewRouter inserted
const shellHead = lines.slice(781, 979).join('\n');
const shellTail = lines.slice(5598).join('\n');
const shell = `${shellHead}
      <ViewRouter />
${shellTail}`;
fs.writeFileSync(
  path.join(root, 'app/AppShell.tsx'),
  `import React from 'react';
import { ViewRouter } from '../views/ViewRouter';
import { useApp } from './AppContext';

export function AppShell() {
  useApp();
  return (
${shell}
  );
}
`
);

console.log('split', viewFiles.length, 'views');
