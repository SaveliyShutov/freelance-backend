import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
  Patch,
} from '@nestjs/common';

import { UserService } from './user.service';
import ApiError from 'src/exceptions/errors/api-error';

// all aboout MongoDB
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserClass } from './schemas/user.schema';

@Controller('user')
export class UserController {
  constructor(
    @InjectModel('User') private UserModel: Model<UserClass>,

    private UserService: UserService,
  ) {}
}
