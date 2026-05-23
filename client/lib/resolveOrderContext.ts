import type { EPal, EPalServiceVariant } from '@shared/types';

export function resolveOrderContext(
  epal: EPal,
  options?: {
    variant?: EPalServiceVariant;
    serviceId?: string;
    activeServiceId?: string | null;
  },
): { variant: EPalServiceVariant; serviceId: string | null } | null {
  const services = epal.services ?? [];

  if (options?.variant) {
    const service =
      (options.serviceId ? services.find(s => s.id === options.serviceId) : undefined) ??
      services.find(s =>
        s.variants.some(
          v =>
            v.name === options.variant!.name &&
            v.price === options.variant!.price &&
            v.unit === options.variant!.unit,
        ),
      );
    return { variant: options.variant, serviceId: service?.id ?? null };
  }

  if (services.length > 0) {
    const service =
      (options?.serviceId ? services.find(s => s.id === options.serviceId) : undefined) ??
      (options?.activeServiceId ? services.find(s => s.id === options.activeServiceId) : undefined) ??
      services[0];
    const variant = service?.variants?.[0];
    if (service && variant) return { variant, serviceId: service.id };
  }

  if (typeof epal.price === 'number' && epal.price > 0) {
    return {
      variant: {
        name: epal.game || 'Gaming Session',
        price: epal.price,
        unit: 'Hour',
      },
      serviceId: null,
    };
  }

  return null;
}
