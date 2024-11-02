import mongoose from "mongoose";

export interface Lesson {
  _id: mongoose.Types.ObjectId,
  name: string,
  shortDescription: string,
  videos: string[],
  homework: string,
  links: string[],
  course: mongoose.Types.ObjectId,
}