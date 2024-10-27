import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';

// mongo models
import CourseModel from './models/course.model';

@Module({
  imports: [
    CourseModel
  ],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
