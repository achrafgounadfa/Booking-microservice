import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class UserProfile extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, unique: true })
  userId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  phoneNumber: string;

  @Prop({ enum: ['fr', 'en'], default: 'fr' })
  language: string;

  @Prop({
    type: {
      street: String,
      city: String,
      postalCode: String,
      country: String,
    },
  })
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };

  @Prop({
    type: {
      eventTypes: [String],
      notifications: {
        email: Boolean,
        sms: Boolean,
      },
    },
    default: {
      eventTypes: [],
      notifications: {
        email: true,
        sms: false,
      },
    },
  })
  preferences: {
    eventTypes: string[];
    notifications: {
      email: boolean;
      sms: boolean;
    };
  };
}

export const UserProfileSchema = SchemaFactory.createForClass(UserProfile);
