export interface Transaction {
  _id?: string;
  userId: string;
  reservationId: string;
  amount: number;
  currency: string;
  paymentMethod: {
    type: PaymentMethodType;
    lastFour?: string;
    cardType?: string;
  };
  status: TransactionStatus;
  paymentIntentId: string;
  refunds?: {
    amount: number;
    reason: string;
    timestamp: Date;
  }[];
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum PaymentMethodType {
  CREDIT_CARD = 'credit_card',
  PAYPAL = 'paypal',
  APPLE_PAY = 'apple_pay',
  GOOGLE_PAY = 'google_pay',
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
}
