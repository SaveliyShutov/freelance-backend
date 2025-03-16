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
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  })
  worker: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  })
  employer: mongoose.Schema.Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(UserClass);