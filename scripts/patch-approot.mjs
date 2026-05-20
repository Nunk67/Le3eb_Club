import fs from 'fs';

const p = 'client/app/AppRoot.tsx';
const lines = fs.readFileSync(p, 'utf8').split('\n');
const head = lines.slice(0, 74);
const tail = lines.slice(742);
const imports = [
  "import { GlassCard } from '../components/ui/GlassCard';",
  "import { IconButton } from '../components/ui/IconButton';",
  "import { WaveAnimation } from '../components/ui/WaveAnimation';",
  "import { CoinIcon } from '../components/ui/CoinIcon';",
  "import { EPalCard } from '../components/cards/EPalCard';",
  "import { LegendEPalCard } from '../components/cards/LegendEPalCard';",
  "import { GameGridItem } from '../components/cards/GameGridItem';",
  "import { WalletView } from '../views/WalletView';",
  "import { RechargeView } from '../views/RechargeView';",
  "import { SettingsSubPage } from '../components/SettingsSubPage';",
  "import { formatChatMessageTime } from '../lib/chatTime';",
  "import { useDeviceId } from '../hooks/useDeviceId';",
  "import { type View, BUSINESS_TOKEN_KEY, BUSINESS_UI_AUTH_KEY, PROTECTED_VIEWS } from '../router/routes';",
  '',
];
const out = [...head, ...imports, ...tail].join('\n');
fs.writeFileSync(p, out);
console.log('AppRoot lines:', out.split('\n').length);
