import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import type { Role } from '../../roles/interfaces/role.interface';
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
  })
  email: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({
    type: Array,
    default: [],
    required: false,
  })
  roles: string[];
}

export const UserSchema = SchemaFactory.createForClass(UserClass);

// // Add a virtual method to populate restaurant details for the manager role
// UserSchema.virtual('managerRests').get(async function () {
//   const managerRole = this.roles.find((role) => role.type === 'manager');
//   if (managerRole && managerRole.rest_ids.length > 0) {
//     // Ensure `rest_ids` is accessible and of the correct type
//     const restIds = managerRole.rest_ids as mongoose.Types.ObjectId[];
//     const restaurants = await RestModel.find({
//       _id: { $in: restIds },
//     }).populate('title').exec();
//     return restaurants;
//   }
//   return [];
// });
