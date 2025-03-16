import mongoose from "mongoose"

export interface User {
  _id: mongoose.Types.ObjectId
  employer?: mongoose.Types.ObjectId
  worker?: mongoose.Types.ObjectId
  password: string
  email: string
}