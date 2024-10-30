import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CourseService } from './course.service';

// all aboout MongoDB
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CourseClass } from './schemas/course.schema';
import { UserClass } from 'src/user/schemas/user.schema';


@Controller('courses')
export class CourseController {
  constructor(
    @InjectModel('Course') private CourseModel: Model<CourseClass>,
    @InjectModel('User') private UserModel: Model<UserClass>,
    private readonly courseService: CourseService
  ) { }

  @Get('')
  async getAll() {
    return await this.CourseModel.find({})
  }

  @Get('one-with-lessons')
  async getCourseByIdWithLessons(
    @Query('course_id') courseId: string
  ) {
    return await this.CourseModel.findById(courseId).populate('lessons')
  }

  @Post('add-user-to-course')
  async addUserToCourse(
    @Body('courseId') courseId: string,
    @Body('userId') userId: string
  ) {
    let result = await this.CourseModel.findByIdAndUpdate(courseId, { $push: { students: userId } })
    if (result) {
      return await this.UserModel.findByIdAndUpdate(userId, { $push: { courses: courseId } })
    }
    return;
  }
}
