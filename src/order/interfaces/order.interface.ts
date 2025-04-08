import mongoose from "mongoose"

export interface Order {
  _id: mongoose.Types.ObjectId
  images?: string[],
  shortDescription: string,
  title: string,
  type: string,
  employer?: string, // employer._id
  date: string,
  hours: number,
  location: string,
  description: string,
  budget: number,
  applications?: []
}

