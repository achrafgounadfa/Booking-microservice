export const RABBITMQ_PATTERNS = {
  TICKET_CREATED: 'ticket.created',
  PAYMENT_COMPLETED: 'payment.completed',
  EVENT_UPDATED: 'event.updated',
  NOTIFICATION_SEND: 'notification.send',
};

export const USER_ROLES = {
  ADMIN: 'admin',
  EVENT_CREATOR: 'event-creator',
  USER: 'user',
};

export const EVENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  CANCELLED: 'cancelled',
  SOLD_OUT: 'sold-out',
  COMPLETED: 'completed',
};

export const TICKET_STATUS = {
  RESERVED: 'reserved',
  PAID: 'paid',
  CANCELLED: 'cancelled',
  USED: 'used',
  REFUNDED: 'refunded',
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  PARTIALLY_REFUNDED: 'partially_refunded',
};

export const NOTIFICATION_STATUS = {
  PENDING: 'pending',
  SENT: 'sent',
  FAILED: 'failed',
  DELIVERED: 'delivered',
};
