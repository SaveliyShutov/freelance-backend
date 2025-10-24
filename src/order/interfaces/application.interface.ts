import mongoose from "mongoose"

export interface Application {
  _id: mongoose.Types.ObjectId
  phone: string,
  letter: string,
  initials: string,
  worker: string,
  order: string,
  employer: mongoose.Types.ObjectId,
  status?: string,
  images?: string[],
  date?: string,
  rating?: string,
}

