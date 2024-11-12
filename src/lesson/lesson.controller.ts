import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { LessonService } from './lesson.service';

// types
import { Lesson } from 'src/course/interfaces/lesson.interface';

// all about MongoDB
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { LessonClass } from 'src/course/schemas/lesson.schema';
import { HomeworkClass } from './schemas/homework.schema';

import YaCloud from 'src/s3/bucket';
const sharp = require('sharp');

@Controller('lesson')
export class LessonController {
  constructor(
    @InjectModel('Lesson') private LessonModel: Model<LessonClass>,
    @InjectModel('Homework') private HomeworkModel: Model<HomeworkClass>,
    private readonly lessonService: LessonService
  ) { }

  @Post('images')
  @UseInterceptors(AnyFilesInterceptor())
  async uploadFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Query('lesson_id') lesson_id: String,
  ) {
    let filenames = [];

    for (let file of files) {
      if (file.originalname.startsWith('logo')) {
        file.buffer = await sharp(file.buffer).resize(300, 300).toBuffer()
      }
      let uploadResult = await YaCloud.Upload({
        file,
        path: 'lessons',
        fileName: file.originalname,
      });
      filenames.push(uploadResult.Location);
    }
    let setObj = {};
    if (filenames[0]) { setObj['images.logo'] = filenames[0]; }
    console.log(lesson_id)
    return await this.LessonModel.findByIdAndUpdate(lesson_id, {
      $set: setObj,
    });
  }

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
