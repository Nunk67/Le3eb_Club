import { spawnSync } from 'node:child_process';

const r = spawnSync(process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm', ['exec', 'vitest', 'run', 'tests/golden'], {
  stdio: 'inherit',
  shell: true,
});
process.exit(r.status ?? 1);
