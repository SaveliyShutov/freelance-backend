import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';

import { TokenService } from 'src/token/token.service';

// mongo models
import CourseModel from './models/course.model';
import LessonModel from './models/lesson.model';
import UserModel from '../user/models/user.model';
import TokenModel from 'src/token/models/token.model';

@Module({
  imports: [
    CourseModel,
    LessonModel,
    UserModel,
    TokenModel,
  ],
  controllers: [CourseController],
  providers: [CourseService, TokenService],
})
export class CourseModule {}
