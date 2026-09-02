export type CheckoutRequest = { userId: string; planCode: string; successUrl?: string };
export type CheckoutResult = { checkoutUrl: string; externalId: string };

export interface PaymentProvider {
  createCheckout(request: CheckoutRequest): Promise<CheckoutResult>;
  verifyPayment(externalId: string): Promise<boolean>;
  handleWebhook(rawBody: string, signature: string): Promise<void>;
  refund(externalId: string): Promise<void>;
}
