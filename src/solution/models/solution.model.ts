import { MongooseModule } from "@nestjs/mongoose";
import { SolutionSchema } from "../schemas/solution.schema"

let SolutionModel = MongooseModule.forFeature([{ name: 'Solution', schema: SolutionSchema, collection: 'solutions' }])
export default SolutionModel