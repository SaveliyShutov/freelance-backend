import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import LessonModel from 'src/course/models/lesson.model';

@Module({
  imports: [LessonModel],
  controllers: [VideoController],
  providers: [VideoService],
})
export class VideoModule {}
