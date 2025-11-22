import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenModule } from 'src/token/token.module';

import { JwtModule } from '@nestjs/jwt';

// mongodb
import UserModel from 'src/user/models/user.model';

@Module({
  imports: [TokenModule, JwtModule, UserModel],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
