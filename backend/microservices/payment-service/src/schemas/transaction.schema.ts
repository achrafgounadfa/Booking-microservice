import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { PAYMENT_STATUS } from '../../../shared/constants/index';

@Schema({ timestamps: true })
export class Transaction extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  userId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  reservationId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, default: 'EUR' })
  currency: string;

  @Prop({
    type: {
      type: { type: String, required: true },
      lastFour: String,
      cardType: String,
    },
    required: true,
  })
  paymentMethod: {
    type: string;
    lastFour?: string;
    cardType?: string;
  };

  @Prop({ 
    required: true, 
    enum: Object.values(PAYMENT_STATUS),
    default: PAYMENT_STATUS.PENDING 
  })
  status: string;

  @Prop({ required: true })
  paymentIntentId: string;

  @Prop({
    type: [{
      amount: { type: Number, required: true },
      reason: { type: String, required: true },
      timestamp: { type: Date, required: true },
    }],
    default: [],
  })
  refunds: {
    amount: number;
    reason: string;
    timestamp: Date;
  }[];

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
