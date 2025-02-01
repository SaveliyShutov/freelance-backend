import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';

import HomeworkModel from './models/homework.model';
import LessonModel from 'src/course/models/lesson.model';

import * as fs from 'fs';
import { diskStorage } from 'multer';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [HomeworkModel, LessonModel,
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          let destination = req.query.destination;

          let uploadPath = `public/lesson/${destination}/any-files/`;

          if (req.path == '/lesson/upload/folder') {
            let splitted = file.originalname.split('___')
            splitted.splice(splitted.length - 1, 1) // remove filename

            let uploadTo = splitted.join('/')
            uploadPath = `public/lesson/${destination}/folders/` + uploadTo; // Specify where to save uploads
          }

          if (req.path == '/lesson/upload/archives') {
            uploadPath = `public/lesson/${destination}/archives/`;
          }

          if (req.path == '/lesson/upload/any-files') {
            uploadPath = `public/lesson/${destination}/any-files/`;
          }

          if (req.path == '/lesson/upload/code') {
            uploadPath = `public/lesson/${destination}/code/`;
          }

          fs.mkdirSync(uploadPath, { recursive: true })
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          let filename = file.originalname;

          if (req.path == '/lesson/upload/folder') {
            let spl = filename.split('___')
            filename = spl[spl.length - 1]
          }

          cb(null, filename); // Custom filename
        },
      }),
    }),
  ],
  controllers: [LessonController],
  providers: [LessonService],
})
export class LessonModule { }
