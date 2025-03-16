import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
export type WorkerDocument = HydratedDocument<WorkerClass>;

@Schema()
export class WorkerClass {
  @Prop({
    type: String,
    required: true,
    min: 2,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    min: 2,
  })
  surname: string

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
    default: ' ',
    required: true
  })
  description: string

  @Prop({
    type: String,
    required: true
  })
  phone: string

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],
    default: [],
    required: false
  })
  applications: mongoose.Schema.Types.ObjectId[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    default: [],
    required: false
  })
  reviews: mongoose.Schema.Types.ObjectId[];

  @Prop({
    type: String,
    default: 'Пермь',
    required: true
  })
  address: string
}

export const WorkerSchema = SchemaFactory.createForClass(WorkerClass);