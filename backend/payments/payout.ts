export type PayoutChannel = 'wise' | 'local-mena' | 'manual';

export interface IPayoutChannel {
  channel: PayoutChannel;
  submit(withdrawalId: string, payoutUsd: number, meta: Record<string, unknown>): Promise<{ queued: boolean; externalRef?: string }>;
}

export class ManualPayoutChannel implements IPayoutChannel {
  channel: PayoutChannel = 'manual';
  async submit(withdrawalId: string, payoutUsd: number) {
    return { queued: true, externalRef: `manual_${withdrawalId}_${payoutUsd}` };
  }
}

export function manualPayoutMarkPaid(request: { id: string; status: string }, adminId: string) {
  if (request.status !== 'APPROVED') {
    return { ok: false as const, reason: 'WITHDRAW_NOT_APPROVED' };
  }
  return { ok: true as const, paidAt: Date.now(), paidBy: adminId };
}
