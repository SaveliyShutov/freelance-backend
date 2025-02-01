import mongoose from "mongoose"
import type { Lesson } from './lesson.interface'

export interface Course {
  _id: mongoose.Types.ObjectId
  images: string[],
  name: string,
  shortDescription: string,
  lessons: Lesson[],
  students: string[],
}
