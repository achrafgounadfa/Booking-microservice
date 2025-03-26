export interface PaymentDto {
  userId: string;
  reservationId: string;
  amount: number;
  currency: string;
  paymentMethod: {
    type: string;
    lastFour?: string;
    cardType?: string;
  };
}

export interface RefundDto {
  transactionId: string;
  amount: number;
  reason: string;
}
