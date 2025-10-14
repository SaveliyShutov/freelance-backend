import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TokenService } from 'src/token/token.service';
import { BotService } from './telegram.service';
// import { VkService } from './vk.service';

// mongo schemas
import { OrderSchema } from './schemas/order.schema';
import { ApplicationSchema } from './schemas/application.schema';
import { UserSchema } from '../user/schemas/user.schema';
import { TokenSchema } from 'src/token/schemas/token.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Order', schema: OrderSchema },
      { name: 'Application', schema: ApplicationSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Token', schema: TokenSchema },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService, TokenService, BotService],
  exports: [OrderService, BotService],
})
export class OrderModule {}
