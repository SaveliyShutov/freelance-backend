import { MongooseModule } from "@nestjs/mongoose";
import { EmployerSchema } from "../schemas/employer.schema";

let EmployerModel = MongooseModule.forFeature([{ name: 'Employer', schema: EmployerSchema, collection: 'employers' }])
export default EmployerModel