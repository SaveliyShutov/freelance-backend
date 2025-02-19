import mongoose from "mongoose"

export interface User {
  _id: mongoose.Types.ObjectId
  name: string
  surname: string
  email: string
  password: string
  phone: string
  role: string
}
