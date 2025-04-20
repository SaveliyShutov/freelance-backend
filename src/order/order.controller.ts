import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from 'src/order/interfaces/order.interface';
import { Application } from 'src/order/interfaces/application.interface';


// all aboout MongoDB
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { OrderClass } from './schemas/order.schema';
import { ApplicationClass } from './schemas/application.schema';
import { UserClass } from 'src/user/schemas/user.schema';

const sharp = require('sharp');

import { AuthGuard } from 'src/auth/auth.guard';

@Controller('order')
export class OrderController {
  constructor(
    @InjectModel('Order') private OrderModel: Model<OrderClass>,
    @InjectModel('Application') private ApplicationModel: Model<ApplicationClass>,
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

  @UseGuards(AuthGuard)
  @Post('get-orders-with-lesson')
  async getOrdersWithApplications(@Body('userOrders') userOrders: string[]) {
    return await this.OrderModel.find({ _id: { $in: userOrders } })
      .populate({
        path: 'applications',
        // select: {
        //   images: 1,
        //   name: 1,
        //   shortDescription: 1,
        //   course: 1,
        // },
      })
  }

  @UseGuards(AuthGuard)
  @Post('get-applications-with-orders')
  async getApplicationsWithOrders(@Body('userApplications') userApplications: string[]) {
    return await this.ApplicationModel.find({ _id: { $in: userApplications } })
      .populate({
        path: 'order',
        // select: {
        //   images: 1,
        //   name: 1,
        //   shortDescription: 1,
        //   course: 1,
        // },
      })
  }

  @UseGuards(AuthGuard)
  @Post('create')
  async createOrder(
    @Body('order') order: Order
  ) {
    let orderFromDb = await this.OrderModel.create(order)
    await this.UserModel.findByIdAndUpdate(order.employer_id, { $push: { employer_orders: orderFromDb._id } })

    return orderFromDb
  }

  @UseGuards(AuthGuard)
  @Post('create-application')
  async createApplication(
    @Body('application') application: Application
  ) {
    let applicationFromDb = await this.ApplicationModel.create(application)
    await this.OrderModel.findByIdAndUpdate(application.order, { $push: { applications: applicationFromDb._id } })
    await this.UserModel.findByIdAndUpdate(application.worker, { $push: { worker_applications: applicationFromDb._id } })

    return applicationFromDb
  }

  @UseGuards(AuthGuard)
  @Get('accept-application')
  async acceptApplication(
    @Query('application_id') application_id: string
  ) {
    let applicationFromDb = await this.ApplicationModel.findById(application_id)
    // await this.OrderModel.findByIdAndUpdate(applicationFromDb.order, { $push: { applications: applicationFromDb._id } })
    await this.ApplicationModel.findByIdAndUpdate(applicationFromDb._id, { status: 'одобрено' })

    return applicationFromDb
  }

  @UseGuards(AuthGuard)
  @Get('decline-application')
  async declineApplication(
    @Query('application_id') application_id: string
  ) {
    let applicationFromDb = await this.ApplicationModel.findById(application_id)
    // await this.OrderModel.findByIdAndUpdate(applicationFromDb.order, { $push: { applications: applicationFromDb._id } })
    await this.ApplicationModel.findByIdAndUpdate(applicationFromDb._id, { status: 'отказано' })

    return applicationFromDb
  }

  @UseGuards(AuthGuard)
  @Get('get-all-applications')
  async getAllApplication(
    @Body('userOrders') userOrders: string[]
  ) {
    // let applicationFromDb = await this.ApplicationModel.findById(application_id)
    // await this.OrderModel.findByIdAndUpdate(applicationFromDb.order, { $push: { applications: applicationFromDb._id } })
    // await this.ApplicationModel.findByIdAndUpdate(applicationFromDb._id, { status: 'отказано' })

    // return applicationFromDb
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