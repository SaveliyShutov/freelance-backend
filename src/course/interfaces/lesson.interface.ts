import mongoose from "mongoose";

interface Link {
  name: string,
  value: string
}

export interface Lesson {
  _id: mongoose.Types.ObjectId,
  name: string,
  shortDescription: string,
  videos: string[],
  homework: string,
  links: Link[],
  course: mongoose.Types.ObjectId,
}