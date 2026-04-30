/** Same-origin in unified `npm run dev` (port 3000). Set in `.env` when UI is served from another origin (e.g. Vite on 5173 + API on 3000). */
export function getApiOrigin(): string {
  const raw = (import.meta as ImportMeta & { env?: { VITE_API_ORIGIN?: string } }).env?.VITE_API_ORIGIN;
  if (raw && String(raw).trim()) {
    return String(raw).trim().replace(/\/$/, '');
  }
  return '';
}

export function apiUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  const base = getApiOrigin();
  return base ? `${base}${p}` : p;
}

export async function readJsonResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') || '';
  const text = await response.text();
  const looksHtml = text.trimStart().startsWith('<');

  if (!response.ok) {
    if (contentType.includes('application/json')) {
      try {
        const payload = JSON.parse(text) as { error?: string };
        throw new Error(payload.error || text || `HTTP ${response.status}`);
      } catch (e) {
        if (e instanceof Error && e.message !== 'Unexpected end of JSON input') throw e;
      }
    }
    if (looksHtml) {
      throw new Error(
        `HTTP ${response.status}: API returned HTML (often wrong dev URL). Open the app at http://localhost:3000 after npm run dev, or set VITE_API_ORIGIN to your API base.`
      );
    }
    throw new Error(text.slice(0, 200) || `HTTP ${response.status}`);
  }

  if (!contentType.includes('application/json') || looksHtml) {
    throw new Error(
      'API returned non-JSON (often the Vite dev page on :5173). Use http://localhost:3000 with npm run dev, or set VITE_API_ORIGIN=http://localhost:3000 in .env when using a separate Vite port.'
    );
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`Invalid JSON from API: ${text.slice(0, 160)}`);
  }
}
