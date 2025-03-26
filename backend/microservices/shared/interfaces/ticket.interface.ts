export interface Ticket {
  _id?: string;
  ticketNumber: string;
  eventId: string;
  eventName: string;
  ticketTypeId: string;
  ticketTypeName: string;
  userId: string;
  userName: string;
  purchaseId: string;
  price: number;
  status: TicketStatus;
  qrCode: string;
  barcode: string;
  seat?: {
    section: string;
    row: string;
    number: string;
  };
  validationHistory?: {
    timestamp: Date;
    action: string;
    operatorId: string;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}

export enum TicketStatus {
  RESERVED = 'reserved',
  PAID = 'paid',
  CANCELLED = 'cancelled',
  USED = 'used',
  REFUNDED = 'refunded',
}
