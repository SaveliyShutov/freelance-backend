import mongoose from "mongoose"

export interface Employer {
  _id: mongoose.Types.ObjectId
  name: string
  avatar: string
  description: string
  shortDescription: string
  address: string
  orders: []
  reviews: []
  rating: string
}