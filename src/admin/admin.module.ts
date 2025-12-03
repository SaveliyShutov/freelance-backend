import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TokenModule } from 'src/token/token.module';
import { AdminGuard } from './admin.guard';

import { JwtModule } from '@nestjs/jwt';
import UserModel from 'src/user/models/user.model';
import OrderModel from 'src/order/models/order.model';

@Module({
  imports: [TokenModule, JwtModule, UserModel, OrderModel],
  controllers: [AdminController],
  providers: [AdminService, AdminGuard],
})
export class AdminModule {}
