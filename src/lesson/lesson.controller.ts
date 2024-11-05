
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { LessonService } from './lesson.service';

// types
import { Lesson } from 'src/course/interfaces/lesson.interface';

// all about MongoDB
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { LessonClass } from 'src/course/schemas/lesson.schema';
import { HomeworkClass } from './schemas/homework.schema';



@Controller('lesson')
export class LessonController {
  constructor(
    @InjectModel('Lesson') private LessonModel: Model<LessonClass>,
    @InjectModel('Homework') private HomeworkModel: Model<HomeworkClass>,
    private readonly lessonService: LessonService
  ) { }

  @Post('update')
  async updateLesson(
    @Body('lesson') lesson: Lesson,
    @Body('newHomeworks') newHomeworks: any
  ) {
    // save new homeworks
    let hwIds = [];
    let homeworksFromDb = await this.HomeworkModel.insertMany(newHomeworks)

    for (let hwFromDb of homeworksFromDb) {
      hwIds.push(hwFromDb._id)
    }

    let lessonFromDb = await this.LessonModel.findById(lesson._id);

    if (lessonFromDb?._id) {
      lessonFromDb.name = lesson.name;
      lessonFromDb.shortDescription = lesson.shortDescription;
      lessonFromDb.links = lesson.links;

      lessonFromDb.homework.push(...hwIds)
      lessonFromDb.markModified('homework')

      return await lessonFromDb.save()
    }
    return;
  }

  @Post('homeworks-by-courses')
  async getHomeworksByCourses(
    @Body('courses') courses: string[]
  ) {
    return await this.HomeworkModel.find({ course: { $in: courses } })
  }
}
