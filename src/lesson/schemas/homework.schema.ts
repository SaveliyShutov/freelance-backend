import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import type { Material } from '../types/material.interface'
import { initialMaterial } from '../types/material.interface'

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
    type: Object,
    default: initialMaterial,
    required: false,
  })
  materials: Material

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  })
  course: mongoose.Schema.Types.ObjectId

  @Prop({
    type: String,
    required: true,
  })
  courseName: string

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true,
  })
  lesson: mongoose.Schema.Types.ObjectId

  @Prop({
    type: Array,
    required: false,
  })
  lessonImages: Object;

  @Prop({
    type: String,
    required: true,
  })
  lessonName: string
}

export const HomeworkSchema = SchemaFactory.createForClass(HomeworkClass)
