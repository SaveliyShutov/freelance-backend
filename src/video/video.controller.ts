import {
  Controller,
  Post,
  Get,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
  Query,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VideoService } from './video.service';

// mongo
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { LessonClass } from 'src/course/schemas/lesson.schema';


@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService,
    @InjectModel('Lesson') private LessonModel: Model<LessonClass>,
  ) { }

  @Post('upload')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('video'))
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Query('lesson_id') lessonId: string,
  ) {
    let result = await this.videoService.handleFileUpload(file);
    return await this.LessonModel.findByIdAndUpdate(lessonId, { $push: { videos: process.env.API_URL + '/static/lesson-videos/' + String(result.filename) } })
  }
}