import mongoose from "mongoose"

export interface Order {
  _id: mongoose.Types.ObjectId
  images?: string[],
  shortDescription: string,
  startTime: string,
  title: string,
  type?: string,
  employer_id?: string, // employer._id
  employer_name?: string, // employer.name
  date: string,
  hours: number,
  address: string,
  description?: string,
  budget: number,
  applications?: []
  paymentType: 'hourly' | 'shift'
}

