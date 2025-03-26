export interface NotificationDto {
  userId: string;
  type: string;
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
}

export interface NotificationTemplateDto {
  name: string;
  type: string;
  subject: string;
  body: string;
  variables: string[];
  language: 'fr' | 'en';
}
