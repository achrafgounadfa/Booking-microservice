import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { NOTIFICATION_STATUS, NOTIFICATION_TYPE } from '../../../shared/constants/index';

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  userId: mongoose.Types.ObjectId;

  @Prop({ 
    required: true, 
    enum: Object.values(NOTIFICATION_TYPE),
  })
  type: string;

  @Prop({ required: true })
  template: string;

  @Prop({
    type: {
      subject: { type: String, required: true },
      body: { type: String, required: true },
    },
    required: true,
  })
  content: {
    subject: string;
    body: string;
  };

  @Prop({
    type: {
      eventId: mongoose.Schema.Types.ObjectId,
      ticketId: mongoose.Schema.Types.ObjectId,
      paymentId: mongoose.Schema.Types.ObjectId,
    },
  })
  metadata?: {
    eventId?: mongoose.Types.ObjectId;
    ticketId?: mongoose.Types.ObjectId;
    paymentId?: mongoose.Types.ObjectId;
  };

  @Prop({ 
    required: true, 
    enum: Object.values(NOTIFICATION_STATUS),
    default: NOTIFICATION_STATUS.PENDING 
  })
  status: string;

  @Prop()
  sentAt: Date;

  @Prop()
  deliveredAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
