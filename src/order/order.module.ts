import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';

import { TokenService } from 'src/token/token.service';

// mongo models
import OrderModel from './models/order.model';
import UserModel from '../user/models/user.model';
import AppicationModel from './models/application.model';
import TokenModel from 'src/token/models/token.model';

@Module({
  imports: [
    OrderModel,
    UserModel,
    TokenModel,
    AppicationModel
  ],
  controllers: [OrderController],
  providers: [OrderService, TokenService],
})
export class OrderModule {}
