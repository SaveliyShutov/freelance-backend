import { MongooseModule } from "@nestjs/mongoose";
import { WorkerSchema } from "../schemas/worker.schema";

let WorkerModel = MongooseModule.forFeature([{ name: 'Worker', schema: WorkerSchema, collection: 'workers' }])
export default WorkerModel