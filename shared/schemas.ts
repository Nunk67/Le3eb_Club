import { z } from 'zod';

export const RegisterBodySchema = z.object({
  username: z.string().min(2).max(32),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  deviceId: z.string().max(128).optional(),
});

export const LoginBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(128),
  deviceId: z.string().max(128).optional(),
});

export const EmailCodePurposeSchema = z.enum(['login', 'register']);

export const EmailCodeSendBodySchema = z.object({
  email: z.string().trim().email(),
  purpose: EmailCodePurposeSchema.default('login'),
  deviceId: z.string().max(128).optional(),
});

export const EmailCodeLoginBodySchema = z.object({
  email: z.string().trim().email(),
  code: z.string().regex(/^\d{6}$/),
  username: z.string().min(2).max(32).optional(),
  deviceId: z.string().max(128).optional(),
});

export const CompanionApplySchema = z.object({
  gameName: z.string().min(1).max(80),
  intro: z.string().min(1).max(2000),
  hourlyRate: z.number().positive().max(500),
});

export const CreateOrderSchema = z.object({
  companionId: z.string().min(1),
  serviceName: z.string().max(120).optional(),
  quantity: z.coerce.number().int().positive().max(100).default(1),
  couponGrantId: z.string().optional(),
});

export const WithdrawRequestSchema = z.object({
  diamondAmount: z.number().int().positive(),
  channel: z.enum(['wise', 'local-mena', 'manual']).default('manual'),
});

export const ExposureBatchSchema = z.object({
  events: z.array(z.object({
    companionId: z.string().min(1),
    type: z.enum(['impression', 'click', 'detail']),
    ts: z.number().int().positive().optional(),
  })).min(1).max(200),
});

export const AdminOperatorPatchSchema = z.object({
  hourlyRate: z.number().positive().max(500).optional(),
  services: z.array(z.object({
    id: z.string(),
    name: z.string(),
    unitPrice: z.number().positive(),
    unit: z.string(),
  })).optional(),
});
