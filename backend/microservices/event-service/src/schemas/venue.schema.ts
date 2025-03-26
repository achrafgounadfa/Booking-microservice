import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Venue extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    type: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    required: true,
  })
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };

  @Prop({ required: true })
  capacity: number;

  @Prop({ type: [String], default: [] })
  amenities: string[];

  @Prop({
    type: {
      main: String,
      gallery: [String],
    },
  })
  images: {
    main: string;
    gallery: string[];
  };
}

export const VenueSchema = SchemaFactory.createForClass(Venue);
