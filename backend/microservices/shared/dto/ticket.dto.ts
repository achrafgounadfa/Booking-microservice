export interface CreateTicketDto {
  eventId: string;
  eventName: string;
  ticketTypeId: string;
  ticketTypeName: string;
  userId: string;
  userName: string;
  price: number;
  seat?: {
    section: string;
    row: string;
    number: string;
  };
}

export interface ReservationDto {
  userId: string;
  eventId: string;
  tickets: {
    ticketTypeId: string;
    quantity: number;
    unitPrice: number;
  }[];
  totalAmount: number;
}
