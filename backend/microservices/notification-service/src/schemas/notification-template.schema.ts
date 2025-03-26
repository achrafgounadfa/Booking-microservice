import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class NotificationTemplate extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, enum: ['email', 'sms'] })
  type: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  body: string;

  @Prop({ type: [String], default: [] })
  variables: string[];

  @Prop({ required: true, enum: ['fr', 'en'], default: 'fr' })
  language: string;
}

export const NotificationTemplateSchema = SchemaFactory.createForClass(NotificationTemplate);
