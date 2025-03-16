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

import { RolesService } from 'src/roles/roles.service';

import { EmployerService } from './employer.service';
import ApiError from 'src/exceptions/errors/api-error';


// types
import { Role } from '../roles/interfaces/role.interface';

// all aboout MongoDB
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmployerClass } from './schemas/employer.schema';


@Controller('employer')
export class EmployerController {
  constructor(
    @InjectModel('Employer') private EmployerModel: Model<EmployerClass>,

    private UserService: EmployerService,
    private RolesService: RolesService,
  ) { }

  @HttpCode(HttpStatus.OK)
  @Get('get-by-id')
  async get_by_id(@Query('_id') _id: string) {
    let candidate = await this.EmployerModel.findById(_id, {
      password: 0,
    }).populate('orders').populate('managerIn');
    if (!candidate)
      throw ApiError.BadRequest('Пользователь с таким ID не найден');

    return candidate;
  }

  // @HttpCode(HttpStatus.OK)
  // @UseGuards(SomeAdminGuard)
  // @Post('change-user')
  // async changeUser(
  //   @Req() req: RequestWithUser,
  //   @Body('user') user: UserFromClient,
  // ) {
  //   let subject_user = await this.UserModel.findById(user._id);

  //   // ... Защиты, проверки

  //   await subject_user.updateOne(user, { runValidators: true });
  // }

  // async addRole(user_email: string, role_type: string) {
  //   let role: Role = {
  //     type: role_type,
  //     rest_ids: [],
  //   };
  //   return await this.UserModel.updateOne(
  //     { email: user_email, 'role.type': { $nin: [role_type] } },
  //     { $addToSet: { roles: role } },
  //     { runValidators: true },
  //   );
  // }

  // async deleteRole(user_email: string, role_type: string) {
  //   return await this.UserModel.updateOne(
  //     { email: user_email },
  //     { $unset: { 'roles.$[t]': '' } },
  //     { arrayFilters: [{ 't.type': role_type }], runValidators: true },
  //   );
  // }
}
