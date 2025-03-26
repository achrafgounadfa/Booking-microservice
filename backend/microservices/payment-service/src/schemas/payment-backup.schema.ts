import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class PaymentBackup extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  transactionId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  backupData: string; // Données de paiement chiffrées

  @Prop({ required: true })
  backupDate: Date;
}

export const PaymentBackupSchema = SchemaFactory.createForClass(PaymentBackup);
