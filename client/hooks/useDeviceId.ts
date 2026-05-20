import { useEffect, useState } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

let cachedDeviceId: string | null = null;

export function useDeviceId() {
  const [deviceId, setDeviceId] = useState<string | null>(cachedDeviceId);

  useEffect(() => {
    if (cachedDeviceId) return;
    let cancelled = false;
    (async () => {
      try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        if (!cancelled) {
          cachedDeviceId = result.visitorId;
          setDeviceId(result.visitorId);
        }
      } catch {
        if (!cancelled) setDeviceId(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return deviceId;
}
