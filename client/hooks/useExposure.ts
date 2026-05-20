import { useCallback, useRef } from 'react';
type Entry = { companionId: string; kind: 'IMPRESSION' | 'CLICK' | 'DETAIL_VIEW'; at: number };

export function useExposureBatch(token: string | null) {
  const queueRef = useRef<Entry[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flush = useCallback(async () => {
    if (!token || queueRef.current.length === 0) return;
    const batch = queueRef.current.splice(0, 200);
    try {
      await fetch('/api/exposure/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ entries: batch }),
      });
    } catch {
      queueRef.current.unshift(...batch);
    }
  }, [token]);

  const track = useCallback(
    (companionId: string, kind: Entry['kind']) => {
      queueRef.current.push({ companionId, kind, at: Date.now() });
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => void flush(), 2000);
    },
    [flush],
  );

  const observeImpression = useCallback(
    (companionId: string, el: Element | null) => {
      if (!el || !token) return () => undefined;
      const io = new IntersectionObserver(
        entries => {
          if (entries.some(e => e.isIntersecting && e.intersectionRatio >= 0.5)) {
            track(companionId, 'IMPRESSION');
          }
        },
        { threshold: [0.5], rootMargin: '0px' },
      );
      io.observe(el);
      return () => io.disconnect();
    },
    [token, track],
  );

  return { track, observeImpression, flush };
}
