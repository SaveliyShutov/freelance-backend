import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from '../schemas/order.schema';

const OrderModel = MongooseModule.forFeature([
  { name: 'Order', schema: OrderSchema, collection: 'orders' },
]);
export default OrderModel;
