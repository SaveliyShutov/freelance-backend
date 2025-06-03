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
  address: string

  @Prop({
    type: String,
  })
  budget: string

  @Prop({
    type: String,
  })
  hours: string
}

export const OrderSchema = SchemaFactory.createForClass(OrderClass)
