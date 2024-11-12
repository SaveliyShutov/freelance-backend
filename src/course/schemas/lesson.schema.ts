import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type LessonDocument = HydratedDocument<LessonClass>

@Schema()
export class LessonClass {
  @Prop({
    type: [String]
  })
  videos: string[]

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
    type: [String]
  })
  links: string[]

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Homework' }],
    default: [],
  })
  homework: mongoose.Schema.Types.ObjectId[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course',
  })
  course: mongoose.Schema.Types.ObjectId
}

export const LessonSchema = SchemaFactory.createForClass(LessonClass)
