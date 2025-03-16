import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
export type EmployerDocument = HydratedDocument<EmployerClass>;

@Schema()
export class EmployerClass {
  @Prop({
    type: String,
    required: true,
    min: 2,
  })
  name: string;

  @Prop({
    type: String,
    required: false
  })
  avatar: string;

  @Prop({
    type: String,
    default: '5',
    required: true
  })
  rating: string

  @Prop({
    type: String,
    default: '',
    required: true
  })
  description: string

  @Prop({
    type: String,
    default: '',
    required: true
  })
  shortDescription: string

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    default: [],
    required: false
  })
  reviews: mongoose.Schema.Types.ObjectId[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    default: [],
    required: false
  })
  orders: mongoose.Schema.Types.ObjectId[];


  @Prop({
    type: String,
    default: 'Пермь',
    required: true
  })
  address: string
}

export const EmployerSchema = SchemaFactory.createForClass(EmployerClass);