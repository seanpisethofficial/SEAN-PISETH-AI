import type { PaymentProvider } from "./payment.provider.js";

export class PaymentService {
  constructor(private readonly provider?: PaymentProvider) {}

  async createCheckout(userId: string, planCode: string) {
    if (!this.provider) throw new Error("Payment provider is not configured");
    return this.provider.createCheckout({ userId, planCode });
  }

  async verify(externalId: string) {
    if (!this.provider) throw new Error("Payment provider is not configured");
    return this.provider.verifyPayment(externalId);
  }
}
