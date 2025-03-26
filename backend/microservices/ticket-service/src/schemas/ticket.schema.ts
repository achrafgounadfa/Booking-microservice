import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { TICKET_STATUS } from '../../../shared/constants/index';

@Schema({ timestamps: true })
export class Ticket extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  eventId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  eventName: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  ticketTypeId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  ticketTypeName: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  userId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  userName: string;

  @Prop({ required: true })
  price: number;

  @Prop({
    type: {
      section: String,
      row: String,
      number: String,
    },
  })
  seat?: {
    section: string;
    row: string;
    number: string;
  };

  @Prop({ 
    required: true, 
    enum: Object.values(TICKET_STATUS),
    default: TICKET_STATUS.RESERVED 
  })
  status: string;

  @Prop()
  qrCode: string;

  @Prop()
  usedAt: Date;

  @Prop()
  cancelledAt: Date;

  @Prop()
  refundedAt: Date;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
