import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards, UploadedFiles, UseInterceptors, Query } from '@nestjs/common'
import { Request, Response } from 'express'
import { AdminService } from './admin.service'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { UserClass } from 'src/user/schemas/user.schema'
import { AdminGuard } from './admin.guard'

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    @InjectModel('User') private readonly UserModel: Model<UserClass>,
  ) {}

  @Get('users')
  @UseGuards(AdminGuard)
  async getAllUsers(@Res() res: Response) {
    try {
      const users = await this.UserModel.find().exec()
      return res.status(HttpStatus.OK).json({ data: users })
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Не удалось получить пользователей',
        error: error.message
      })
    }
  }
}
