import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { OrderService } from './order.service';

// all aboout MongoDB
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { OrderClass } from './schemas/order.schema';
import { UserClass } from 'src/user/schemas/user.schema';

import YaCloud from 'src/s3/bucket';
const sharp = require('sharp');

import { AuthGuard } from 'src/auth/auth.guard';


@Controller('orders')
export class OrderController {
  constructor(
    @InjectModel('Order') private OrderModel: Model<OrderClass>,
    @InjectModel('User') private UserModel: Model<UserClass>,
    private readonly orderService: OrderService
  ) { }

  @UseGuards(AuthGuard)
  @Post('get-all')
  async getAll(
  ) {
    return await this.OrderModel.find()
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

  @Post('create')
  async createOrder(
    @Body('order') order: any
  ) {
    let orderFromDb = await this.OrderModel.create(order)
    // await this.UserModel.findByIdAndUpdate(order.organisation, { $push: { createdCourses: courseFromDb._id } })

    return orderFromDb
  }
}