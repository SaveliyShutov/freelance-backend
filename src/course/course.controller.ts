import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CourseService } from './course.service';

// all aboout MongoDB
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CourseClass } from './schemas/course.schema';
import { UserClass } from 'src/user/schemas/user.schema';
import { LessonClass } from './schemas/lesson.schema';


@Controller('courses')
export class CourseController {
  constructor(
    @InjectModel('Course') private CourseModel: Model<CourseClass>,
    @InjectModel('User') private UserModel: Model<UserClass>,
    @InjectModel('Lesson') private LessonModel: Model<LessonClass>,
    private readonly courseService: CourseService
  ) { }

  @Post('')
  async getAll(
    @Body('courses') courses: any
  ) {
    // когда админ - получает все курсы
    // когда обычный пользователь только свои курсы    
    if (courses instanceof Array) {
      return await this.CourseModel.find({ _id: { $in: courses } })
    } else {
      return await this.CourseModel.find({})
    }
  }

  @Get('one-with-lessons')
  async getCourseByIdWithLessons(
    @Query('course_id') courseId: string
  ) {
    return await this.CourseModel.findById(courseId).populate({ path: 'lessons', populate: { path: 'homework' } })
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

  @Post('create-lesson')
  async createLesson(
    @Body('courseId') courseId: string,
    @Body('lesson') lesson: any
  ) {
    lesson.course = courseId;
    let lessonFromDb = await this.LessonModel.create(lesson)
    if (lessonFromDb._id) {
      return await this.CourseModel.findByIdAndUpdate(courseId, { $push: { lessons: lessonFromDb._id } })
    }
    return;
  }

  @Post('create')
  async createCourse(
    @Body('course') course: any
  ) {
    return await this.CourseModel.create(course)
  }

  @Get('get-lessons-by-course')
  async getLessonsByCourseId(
    @Query('course_id') courseId: string
  ) {
    return await this.CourseModel.findById(courseId, { lessons: 1 }).populate({
      path: 'lessons', populate: {
        path: 'homework',
        model: 'Homework',
      }
    })
  }
}