import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Res,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AdminService } from './admin.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserClass } from 'src/user/schemas/user.schema';
import { OrderClass } from 'src/order/schemas/order.schema';
import { AdminGuard } from './admin.guard';
import { User } from '../user/interfaces/user.interface';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    @InjectModel('User') private readonly UserModel: Model<UserClass>,
    @InjectModel('Order') private readonly OrderModel: Model<OrderClass>,
  ) {}

  @Get('users')
  @UseGuards(AdminGuard)
  async getAllUsers(@Res() res: Response) {
    try {
      const users = await this.UserModel.find().exec();
      return res.status(HttpStatus.OK).json({ data: users });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Не удалось получить пользователей',
        error: error.message,
      });
    }
  }

  @Delete('user')
  @UseGuards(AdminGuard)
  async deleteUser(@Body('_id') id: string, @Res() res: Response) {
    try {
      if (!id) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Не передан _id пользователя',
        });
      }

      await this.UserModel.findByIdAndDelete(id).exec();

      const users = await this.UserModel.find().exec();

      return res.status(HttpStatus.OK).json({ data: users });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Не удалось удалить пользователя',
        error: error.message,
      });
    }
  }

  @Put('user')
  @UseGuards(AdminGuard)
  async updateUser(
    @Body() dto: Partial<User> & { _id: string },
    @Res() res: Response,
  ) {
    try {
      const { _id, ...updateFields } = dto;

      if (!_id) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Не передан _id пользователя',
        });
      }

      const updatedUser = await this.UserModel.findByIdAndUpdate(
        _id,
        { $set: updateFields },
        { new: true },
      ).exec();

      if (!updatedUser) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Пользователь не найден',
        });
      }

      return res.status(HttpStatus.OK).json({ data: updatedUser });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Не удалось обновить пользователя',
        error: error.message,
      });
    }
  }

  @Get('orders')
  @UseGuards(AdminGuard)
  async getAllOrder(@Res() res: Response) {
    try {
      const orders = await this.OrderModel.find().exec();
      return res.status(HttpStatus.OK).json({ data: orders });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Не удалось получить заказы',
        error: error.message,
      });
    }
  }
}
