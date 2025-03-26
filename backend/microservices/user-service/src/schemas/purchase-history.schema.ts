import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class PurchaseHistory extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  userId: mongoose.Types.ObjectId;

  @Prop({
    type: [{
      ticketId: { type: mongoose.Schema.Types.ObjectId, required: true },
      eventId: { type: mongoose.Schema.Types.ObjectId, required: true },
      eventName: { type: String, required: true },
      purchaseDate: { type: Date, required: true },
      price: { type: Number, required: true },
      status: { 
        type: String, 
        enum: ['active', 'used', 'cancelled', 'refunded'],
        default: 'active'
      },
    }],
    default: [],
  })
  tickets: {
    ticketId: mongoose.Types.ObjectId;
    eventId: mongoose.Types.ObjectId;
    eventName: string;
    purchaseDate: Date;
    price: number;
    status: string;
  }[];
}

export const PurchaseHistorySchema = SchemaFactory.createForClass(PurchaseHistory);
