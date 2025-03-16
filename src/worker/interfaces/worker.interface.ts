import mongoose from "mongoose"

export interface Worker {
  _id: mongoose.Types.ObjectId
  phone: string
  name: string
  surname: string
  avatar: string
  description: string
  address: string
  applications: []
  reviews: []
  rating: string
}