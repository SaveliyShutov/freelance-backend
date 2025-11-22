import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import UserModel from './models/user.model';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [UserModel, JwtModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
