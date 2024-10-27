import { MongooseModule } from "@nestjs/mongoose";
import { LessonSchema } from "../schemas/lesson.schema"

let LessonModel = MongooseModule.forFeature([{ name: 'Lesson', schema: LessonSchema, collection: 'lessons' }])
export default LessonModel