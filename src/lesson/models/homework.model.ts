import { MongooseModule } from "@nestjs/mongoose";
import { HomeworkSchema } from "../schemas/homework.schema"

let HomeworkModel = MongooseModule.forFeature([{ name: 'Homework', schema: HomeworkSchema, collection: 'homeworks' }])
export default HomeworkModel