import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
export type UserDocument = HydratedDocument<UserClass>;

@Schema()
export class UserClass {
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
    required: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({
    type: String,
    default: 'worker',
    required: true,
  })
  role: string;

  @Prop({
    type: Array,
    default: [],
    required: false
  })
  avatars: string[];

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
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    default: [],
  })
  orders: mongoose.Schema.Types.ObjectId[];

  @Prop({
    type: String,
    required: false
  })
  organization: string

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],
    default: [],
  })
  applications: mongoose.Schema.Types.ObjectId[];

  @Prop({
    type: String,
    default: 'Пермь',
    required: true
  })
  address: string
}

export const UserSchema = SchemaFactory.createForClass(UserClass);