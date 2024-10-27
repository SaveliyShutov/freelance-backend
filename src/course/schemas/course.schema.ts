import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CourseDocument = HydratedDocument<CourseClass>

@Schema()
export class CourseClass {
  @Prop({
    type: [String]
  })
  images: string[]
  
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
}

export const CourseSchema = SchemaFactory.createForClass(CourseClass)
