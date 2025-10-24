import { Injectable } from '@nestjs/common'
import { TokenService } from 'src/token/token.service'
import { Model } from 'mongoose'
import ApiError from 'src/exceptions/errors/api-error'
import { InjectModel } from '@nestjs/mongoose'
import { UserClass } from 'src/user/schemas/user.schema'
import { User } from 'src/user/interfaces/user.interface'
import * as bcrypt from 'bcryptjs'
import { UserFromClient } from 'src/user/interfaces/user-from-client.interface';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel('User') private UserModel: Model<UserClass>,
    private TokenService: TokenService,
  ) { }
}
