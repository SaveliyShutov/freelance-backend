import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';

// mongo models
import CourseModel from './models/course.model';
import LessonModel from './models/lesson.model';

@Module({
  imports: [
    CourseModel,
    LessonModel,
  ],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
