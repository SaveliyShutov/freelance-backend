import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from 'src/order/interfaces/order.interface';

// all aboout MongoDB
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { OrderClass } from './schemas/order.schema';
import { UserClass } from 'src/user/schemas/user.schema';

const sharp = require('sharp');

import { AuthGuard } from 'src/auth/auth.guard';

@Controller('order')
export class OrderController {
  constructor(
    @InjectModel('Order') private OrderModel: Model<OrderClass>,
    @InjectModel('User') private UserModel: Model<UserClass>,
    private readonly orderService: OrderService
  ) { }

  @UseGuards(AuthGuard)
  @Get('get-all')
  async getAll(
  ) {
    return await this.OrderModel.find()
  }

  @UseGuards(AuthGuard)
  @Get('get-by-id')
  async getById(
    @Query('order_id') order_id: string
  ) {
    try {
      return await this.OrderModel.findById(order_id)
    } catch (error) {
      return error
    }
  }

  @Post('create')
  async createOrder(
    @Body('order') order: Order
  ) {
    let orderFromDb = await this.OrderModel.create(order)
    await this.UserModel.findByIdAndUpdate(order.employer_id, { $push: { employer_orders: orderFromDb._id } })

    return orderFromDb
  }

  // @Post('add-user-to-course')
  // async addUserToCourse(
  //   @Body('courseId') courseId: string,
  //   @Body('userId') userId: string
  // ) {
  //   let result = await this.CourseModel.findByIdAndUpdate(courseId, { $push: { students: userId } })
  //   if (result) {
  //     return await this.UserModel.findByIdAndUpdate(userId, { $push: { myCourses: courseId } })
  //   }
  //   return;
  // }

  // @Post('images')
  // @UseInterceptors(AnyFilesInterceptor())
  // async uploadFile(
  //   @UploadedFiles() files: Array<Express.Multer.File>,
  //   @Query('course_id') course_id: String,
  // ) {
  //   let filenames = [];

  //   for (let file of files) {
  //     if (file.originalname.startsWith('logo')) {
  //       file.buffer = await sharp(file.buffer).resize(300, 300).toBuffer()
  //     }
  //     let uploadResult = await YaCloud.Upload({
  //       file,
  //       path: 'courses',
  //       fileName: file.originalname,
  //     });
  //     filenames.push(uploadResult.Location);
  //   }
  //   let setObj = {};
  //   if (filenames[0]) { setObj['images.logo'] = filenames[0] };

  //   return await this.CourseModel.findByIdAndUpdate(course_id, {
  //     $set: setObj,
  //   });
  // }
}