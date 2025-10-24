import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from 'src/order/interfaces/order.interface';
import { Application } from 'src/order/interfaces/application.interface';
import axios from 'axios';

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
    private readonly orderService: OrderService,
  ) { }

  @Get('get-all')
  async getAll() {
    const now = new Date();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(todayStart.getDate() - 1);

    const futureAndToday = await this.OrderModel.find({
      date: { $gte: todayStart }
    })
      .sort({ date: 1 })
      .limit(100)
      .exec();

    const yesterday = await this.OrderModel.find({
      date: { $gte: yesterdayStart, $lt: todayStart }
    })
      .sort({ date: 1 })
      .limit(100)
      .exec();

    const vacancies = await this.OrderModel.find({
      date: null
    })
      .sort({ createdAt: -1 })
      .limit(100)
      .exec();

    return {
      futureAndToday,
      yesterday,
      vacancies
    };
  }


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
    const botUrl = process.env.BOTSERVICE_URL;
    if (botUrl) {
      axios.post(botUrl, {
        title: orderFromDb.title,
        description: orderFromDb.description,
        date: orderFromDb.date,
        address: orderFromDb.address,
        budget: orderFromDb.budget,
        startTime: orderFromDb.startTime,
        hours: orderFromDb.hours,
        paymentType: orderFromDb.paymentType,
        dateType: orderFromDb.dateType,
        employerName: orderFromDb.employer_name
      })
        .then(() => console.log('✅ Заказ отправлен в botservice'))
        .catch(err => console.error('❌ Ошибка при запросе к botservice:', err.message));
    } else {
      console.warn('⚠️ BOTSERVICE_URL не задан в .env');
    }
    return orderFromDb
  }

  @Post('create-from-bot')
  async createOrderFromBot(@Body('order') order: Order) {
    try {
      const orderFromDb = await this.OrderModel.create(order);

      // Если хочешь, можешь сразу дергать UserModel или триггерить рассылку
      await this.UserModel.findByIdAndUpdate(order.employer_id, {
        $push: { employer_orders: orderFromDb._id }
      }).catch(() => null);

      // А тут вызываем твою логику рассылки
      const botUrl = process.env.BOTSERVICE_URL;
      if (botUrl) {
        axios.post(botUrl + '/botservice/send', {
          title: orderFromDb.title,
          description: orderFromDb.description,
          date: orderFromDb.date,
          address: orderFromDb.address,
          budget: orderFromDb.budget,
          startTime: orderFromDb.startTime,
          hours: orderFromDb.hours,
          paymentType: orderFromDb.paymentType,
          dateType: orderFromDb.dateType,
          employerName: orderFromDb.employer_name,
        }).catch(err => console.error('⚠️ Ошибка при рассылке:', err.message));
      }

      return { success: true, order: orderFromDb };
    } catch (err) {
      console.error('❌ Ошибка при создании ордера ботом:', err.message);
      return { success: false, error: err.message };
    }
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
}