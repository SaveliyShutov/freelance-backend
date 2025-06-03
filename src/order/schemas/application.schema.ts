import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ApplicationDocument = HydratedDocument<ApplicationClass>

@Schema()
export class ApplicationClass {
  @Prop({
    type: String,
  })
  phone: string

  @Prop({
    type: String,
  })
  letter: string

  @Prop({
    type: String,
  })
  initials: string

  @Prop({
    type: mongoose.Schema.Types.ObjectId, ref: 'User',
  })
  worker: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId, ref: 'Order',
  })
  order: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId, ref: 'User',
  })
  employer: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: String,
    default: 'в расмотрении',
  })
  status: string

  @Prop({
    type: Array,
    required: false,
  })
  images: Object;

  @Prop({
    type: Date,
  })
  date: Date

  @Prop({
    type: String,
  })
  rating: string

}

export const ApplicationSchema = SchemaFactory.createForClass(ApplicationClass)
