import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CourseDocument = HydratedDocument<CourseClass>

@Schema()
export class CourseClass {
  @Prop({
    type: Array,
    required: false,
  })
  images: Object;

  @Prop({
    type: String,
  })
  name: string

  @Prop({
    type: String,
  })
  shortDescription: string

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    default: [],
  })
  lessons: mongoose.Schema.Types.ObjectId[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  students: mongoose.Schema.Types.ObjectId[];
}

export const CourseSchema = SchemaFactory.createForClass(CourseClass)
