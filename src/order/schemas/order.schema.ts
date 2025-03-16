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
  name: string

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
  employer: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: String,
  })
  date: string

  @Prop({
    type: String,
  })
  adress: string

  @Prop({
    type: String,
  })
  price: string

  @Prop({
    type: String,
  })
  hours: string
}

export const OrderSchema = SchemaFactory.createForClass(OrderClass)
