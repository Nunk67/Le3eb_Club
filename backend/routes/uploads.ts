import type express from 'express';
import type { AppContext } from '../app/context.js';
import { resolveObjectStore, validateUploadMime } from '../storage/objectStore.js';

export function registerUploadRoutes(app: express.Application, ctx: AppContext) {
  app.post('/api/uploads/signed', ctx.authMiddleware, async (req, res) => {
    const kind = req.body?.kind === 'video' ? 'video' : 'image';
    const mime = String(req.body?.mime || (kind === 'video' ? 'video/mp4' : 'image/jpeg'));
    const check = validateUploadMime(mime, kind);
    if (!check.ok) return ctx.sendError(res, 400, 'UPLOAD_MIME_INVALID', 'MIME not allowed');
    const key = `uploads/${(req as any).authUserId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const store = resolveObjectStore();
    const signed = await store.presignPut(key, mime, check.maxBytes);
    res.json({ ...signed, fields: {}, maxBytes: check.maxBytes });
  });

  app.post('/api/uploads/commit', ctx.authMiddleware, (req, res) => {
    res.status(201).json({
      id: `asset_${Math.random().toString(36).slice(2, 9)}`,
      key: req.body?.key,
      status: 'PENDING',
      ownerId: (req as any).authUserId,
    });
  });
}
