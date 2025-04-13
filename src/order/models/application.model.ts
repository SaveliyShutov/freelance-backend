import { MongooseModule } from "@nestjs/mongoose";
import { ApplicationSchema } from "../schemas/application.schema"

let ApplicationModel = MongooseModule.forFeature([{ name: 'Application', schema: ApplicationSchema, collection: 'applications' }])
export default ApplicationModel