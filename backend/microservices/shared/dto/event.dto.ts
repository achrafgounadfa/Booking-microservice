export interface CreateEventDto {
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
    name: string;
    description: string;
    price: number;
    quantity: number;
  }[];
  tags: string[];
}

export interface UpdateEventDto {
  name?: string;
  description?: string;
  category?: string;
  images?: {
    thumbnail?: string;
    banner?: string;
    gallery?: string[];
  };
  location?: {
    venueId?: string;
    venueName?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    coordinates?: {
      latitude?: number;
      longitude?: number;
    }
  };
  dates?: {
    start?: Date;
    end?: Date;
    doorsOpen?: Date;
  };
  ticketTypes?: {
    _id?: string;
    name?: string;
    description?: string;
    price?: number;
    quantity?: number;
    remaining?: number;
  }[];
  status?: string;
  tags?: string[];
}
