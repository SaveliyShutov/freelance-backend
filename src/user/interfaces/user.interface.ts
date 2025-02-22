import mongoose from "mongoose"

export interface User {
  _id: mongoose.Types.ObjectId
  organisation: mongoose.Types.ObjectId
  name: string
  surname: string
  address: string
  phone: string
	description: string
  email: string
  password: string
  role: string
  applications: string[]
  orders: string[]
  avatars: string[]
  rating: string
}