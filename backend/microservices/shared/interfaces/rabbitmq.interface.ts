export interface RabbitMQMessage {
  pattern: string;
  data: any;
}

export enum RabbitMQPatterns {
  TICKET_CREATED = 'ticket.created',
  PAYMENT_COMPLETED = 'payment.completed',
  EVENT_UPDATED = 'event.updated',
  NOTIFICATION_SEND = 'notification.send',
}

export interface RabbitMQConfig {
  urls: string[];
  queue: string;
  queueOptions?: {
    durable?: boolean;
    arguments?: Record<string, any>;
  };
}
