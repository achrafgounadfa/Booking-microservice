export interface Event {
  _id?: string;
  name: string;
  description: string;
  organizerId: string;
  category: string;
  images: {
    thumbnail: string;
    banner: string;
    gallery: string[];
  };
  location: {
    venueId: string;
    venueName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    }
  };
  dates: {
    start: Date;
    end: Date;
    doorsOpen: Date;
  };
  ticketTypes: {
    _id?: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    remaining: number;
  }[];
  status: EventStatus;
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export enum EventStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CANCELLED = 'cancelled',
  SOLD_OUT = 'sold-out',
  COMPLETED = 'completed',
}
