import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TokenModule } from 'src/token/token.module';
import { AdminGuard } from './admin.guard';

import { JwtModule } from '@nestjs/jwt';
import UserModel from 'src/user/models/user.model';


@Module({
  imports: [
    TokenModule,
    JwtModule,
    UserModel,
  ],
  controllers: [AdminController],
  providers: [AdminService, AdminGuard]
})
export class AdminModule {}
