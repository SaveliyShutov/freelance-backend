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
    type: String,
  })
  name: string

  @Prop({
    type: String,
  })
  shortDescription: string

  @Prop({
    type: String,
  })
  homework: string
}

export const LessonSchema = SchemaFactory.createForClass(LessonClass)
