import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';

import HomeworkModel from './models/homework.model';
import LessonModel from 'src/course/models/lesson.model';

@Module({
  imports: [HomeworkModel, LessonModel],
  controllers: [LessonController],
  providers: [LessonService],
})
export class LessonModule { }
