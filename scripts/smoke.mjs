const base = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:3000';

async function check(path, expectStatus = 200) {
  const res = await fetch(`${base}${path}`);
  if (res.status !== expectStatus) throw new Error(`${path} => ${res.status}`);
  return res;
}

const paths = ['/healthz', '/ready', '/metrics', '/api/companions/rankings?limit=3'];

let failed = 0;
for (const p of paths) {
  try {
    await check(p);
    console.log('ok', p);
  } catch (e) {
    failed++;
    console.error('fail', p, e.message);
  }
}

process.exit(failed ? 1 : 0);
