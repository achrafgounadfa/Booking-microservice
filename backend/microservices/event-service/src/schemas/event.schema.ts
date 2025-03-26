import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { EVENT_STATUS } from '../../../shared/constants/index';

@Schema({ timestamps: true })
export class Event extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  organizerId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  category: string;

  @Prop({
    type: {
      thumbnail: String,
      banner: String,
      gallery: [String],
    },
    required: true,
  })
  images: {
    thumbnail: string;
    banner: string;
    gallery: string[];
  };

  @Prop({
    type: {
      venueId: { type: mongoose.Schema.Types.ObjectId, required: true },
      venueName: { type: String, required: true },
      address: { type: String, required: true },
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
  location: {
    venueId: mongoose.Types.ObjectId;
    venueName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };

  @Prop({
    type: {
      start: { type: Date, required: true },
      end: { type: Date, required: true },
      doorsOpen: { type: Date, required: true },
    },
    required: true,
  })
  dates: {
    start: Date;
    end: Date;
    doorsOpen: Date;
  };

  @Prop({
    type: [{
      name: { type: String, required: true },
      description: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      remaining: { type: Number, required: true },
    }],
    required: true,
  })
  ticketTypes: {
    name: string;
    description: string;
    price: number;
    quantity: number;
    remaining: number;
  }[];

  @Prop({ 
    required: true, 
    enum: Object.values(EVENT_STATUS),
    default: EVENT_STATUS.DRAFT 
  })
  status: string;

  @Prop({ type: [String], default: [] })
  tags: string[];
}

export const EventSchema = SchemaFactory.createForClass(Event);
