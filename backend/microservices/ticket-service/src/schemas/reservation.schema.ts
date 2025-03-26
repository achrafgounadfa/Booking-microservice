import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Reservation extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  userId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  eventId: mongoose.Types.ObjectId;

  @Prop({
    type: [{
      ticketTypeId: { type: mongoose.Schema.Types.ObjectId, required: true },
      quantity: { type: Number, required: true },
      unitPrice: { type: Number, required: true },
    }],
    required: true,
  })
  tickets: {
    ticketTypeId: mongoose.Types.ObjectId;
    quantity: number;
    unitPrice: number;
  }[];

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ 
    required: true, 
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending' 
  })
  status: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], default: [] })
  ticketIds: mongoose.Types.ObjectId[];

  @Prop()
  expiresAt: Date;

  @Prop()
  confirmedAt: Date;

  @Prop()
  cancelledAt: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  paymentId: mongoose.Types.ObjectId;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
