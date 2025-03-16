import mongoose from "mongoose"

export interface Order {
  _id: mongoose.Types.ObjectId
  images: string[],
  name: string,
  shortDescription: string,
  students: string[],
}
