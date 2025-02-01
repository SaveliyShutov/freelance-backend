import { MongooseModule } from "@nestjs/mongoose";
import { CourseSchema } from "../schemas/course.schema"

let CourseModel = MongooseModule.forFeature([{ name: 'Course', schema: CourseSchema, collection: 'courses' }])
export default CourseModel