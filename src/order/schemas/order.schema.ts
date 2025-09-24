import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type OrderDocument = HydratedDocument<OrderClass>

@Schema()
export class OrderClass {
  @Prop({
    type: Array,
    required: false,
  })
  images: Object;

  @Prop({
    type: String,
    required: true,
  })
  title: string

  @Prop({
    type: String,
  })
  shortDescription: string

  @Prop({
    type: String,
  })
  description: string

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],
    default: [],
  })
  applications: mongoose.Schema.Types.ObjectId[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId, ref: 'User',
  })
  employer_id: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: String,
  })
  employer_name: string

  @Prop({
    type: Date,
  })
  date: Date

  @Prop({
    type: String,
  })
  startTime: string

  @Prop({
    type: String,
  })
  address: string

  @Prop({
    type: String,
  })
  budget: string

  @Prop({
    type: String,
  })
  hours: string

  @Prop({ type: String, enum: ['hourly', 'shift', 'deal'], required: true })
  paymentType: 'hourly' | 'shift' | 'deal';

  @Prop({
    type: String,
  })
  type: string;

  @Prop({
    type: Date,
    default: () => new Date(),
  })
  createdAt: Date;

  @Prop({
    type: String,
    enum: ['date', 'by agreement'],
    required: false,
  })
  dateType?: 'date' | 'by agreement';
}

export const OrderSchema = SchemaFactory.createForClass(OrderClass)
