import mongoose from "mongoose"

export interface User {
	_id: mongoose.Types.ObjectId
	password: string
	email: string
	employer_avatar?: string,
	employer_name?: string,
	employer_surname?: string,
	employer_shortDescription?: string,
	employer_description?: string,
	employer_rating?: string,
	employer_reviews?: [],
	employer_orders?: [],
	employer_address?: string,
	employer_contacts?: string,
	worker_name?: string,
	worker_surname?: string,
	worker_avatar?: string,
	worker_description?: string,
	worker_applications?: [],
	worker_reviews?: [],
	worker_address?: string,
	worker_phone?: string,
	worker_rating?: string,
	is_admin?: boolean,
}