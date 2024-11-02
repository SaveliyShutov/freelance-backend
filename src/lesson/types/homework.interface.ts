import mongoose from "mongoose"

export interface Homework {
  _id: mongoose.Types.ObjectId,
  hwText: string,
  materials: any[],
  course: mongoose.Types.ObjectId,
  lesson: mongoose.Types.ObjectId,
  courseName: string,
  lessonName: string,
}