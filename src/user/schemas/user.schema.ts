import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
export type UserDocument = HydratedDocument<UserClass>;

@Schema()
export class UserClass {
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
    required: false,
  })
  employer_avatar: string;

  @Prop({
    type: String,
    required: false,
  })
  employer_name: string;

  @Prop({
    type: String,
    required: false,
  })
  employer_shortDescription: string;

  @Prop({
    type: String,
    required: false,
  })
  employer_description: string;

  @Prop({
    type: String,
    required: false,
  })
  employer_rating: string;

  @Prop({
    type: Array,
    required: false,
  })
  employer_reviews: string[];

  @Prop({
    type: Array,
    required: false,
  })
  employer_orders: string[];

  @Prop({
    type: String,
    required: false,
  })
  employer_address: string;

  @Prop({
    type: String,
    required: false,
  })
  employer_contacts: string;

  @Prop({
    type: String,
    required: false,
  })
  worker_name: string;

  @Prop({
    type: String,
    required: false,
  })
  worker_surname: string;

  @Prop({
    type: String,
    required: false,
  })
  worker_avatar: string;

  @Prop({
    type: String,
    required: false,
  })
  worker_description: string;

  @Prop({
    type: Array,
    required: false,
  })
  worker_applications: string[];

  @Prop({
    type: Array,
    required: false,
  })
  worker_reviews: string[];

  @Prop({
    type: String,
    required: false,
  })
  worker_address: string;

  @Prop({
    type: String,
    required: false,
  })
  worker_phone: string;

  @Prop({
    type: String,
    required: false,
  })
  worker_rating: string;

  @Prop({
    type: Boolean,
    required: false,
  })
  is_admin: boolean;
}

export const UserSchema = SchemaFactory.createForClass(UserClass);
