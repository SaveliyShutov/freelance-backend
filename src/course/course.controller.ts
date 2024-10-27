import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CourseService } from './course.service';

// all aboout MongoDB
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CourseClass } from './schemas/course.schema';


@Controller('courses')
export class CourseController {
  constructor(
    @InjectModel('Course') private CourseModel: Model<CourseClass>,
    private readonly courseService: CourseService
  ) {}

  @Get('')
  async getAll() {
    return this.CourseModel.find({})
  }
}
