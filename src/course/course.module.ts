import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';

// mongo models
import CourseModel from './models/course.model';
import LessonModel from './models/lesson.model';
import UserModel from '../user/models/user.model';

@Module({
  imports: [
    CourseModel,
    LessonModel,
    UserModel,
  ],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
