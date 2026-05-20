import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';

export function zValidate<T>(schema: ZodSchema<T>, source: 'body' | 'query' = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    const raw = source === 'body' ? req.body : req.query;
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      return res.status(400).json({
        error: {
          code: 'INPUT_INVALID',
          message: 'Validation failed',
          issues: parsed.error.issues.map(i => ({ path: i.path.join('.'), message: i.message })),
        },
      });
    }
    if (source === 'body') (req as Request & { validatedBody: T }).validatedBody = parsed.data;
    else (req as Request & { validatedQuery: T }).validatedQuery = parsed.data;
    next();
  };
}
