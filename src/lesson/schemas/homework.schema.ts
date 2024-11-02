import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type HomeworkDocument = HydratedDocument<HomeworkClass>

@Schema()
export class HomeworkClass {  
  @Prop({
    type: String,
  })
  name: string

  @Prop({
    type: String,
  })
  hwText: string

  @Prop({
    type: [String],
  })
  materials: string[]

  @Prop({
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course',
  })
  course: mongoose.Schema.Types.ObjectId

  @Prop({
    type: String,
  })
  courseName: string

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
  })
  lesson: mongoose.Schema.Types.ObjectId

  @Prop({
    type: String,
  })
  lessonName: string
}

export const HomeworkSchema = SchemaFactory.createForClass(HomeworkClass)
