export interface Notification {
  _id?: string;
  userId: string;
  type: NotificationType;
  template: string;
  content: {
    subject: string;
    body: string;
  };
  metadata?: {
    eventId?: string;
    ticketId?: string;
    paymentId?: string;
  };
  status: NotificationStatus;
  sentAt?: Date;
  deliveredAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum NotificationType {
  EMAIL = 'email',
  SMS = 'sms',
}

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
  DELIVERED = 'delivered',
}
