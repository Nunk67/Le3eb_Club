import client from 'prom-client';

export const register = new client.Registry();
client.collectDefaultMetrics({ register });

export const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'HTTP requests',
  labelNames: ['method', 'route', 'status'] as const,
  registers: [register],
});

export const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP duration',
  labelNames: ['method', 'route'] as const,
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
  registers: [register],
});

export const withdrawPendingCount = new client.Gauge({
  name: 'business_withdraw_pending_count',
  help: 'Pending withdrawals',
  registers: [register],
});

export function metricsMiddleware() {
  return (req: import('express').Request, res: import('express').Response, next: import('express').NextFunction) => {
    const start = process.hrtime.bigint();
    res.on('finish', () => {
      const route = req.route?.path ? String(req.route.path) : req.path.split('?')[0];
      const status = String(res.statusCode);
      httpRequestsTotal.inc({ method: req.method, route, status });
      const dur = Number(process.hrtime.bigint() - start) / 1e9;
      httpRequestDuration.observe({ method: req.method, route }, dur);
    });
    next();
  };
}
