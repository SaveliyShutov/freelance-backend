import { Injectable } from '@nestjs/common';
import { writeFile } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class VideoService {
  // Your business logic around video processing can go here
  async handleFileUpload(file: Express.Multer.File) {
    let customFilename = Date.now() + '_' + file.originalname;
    const filePath = join(__dirname, '..', '..', 'public', 'lesson-videos', customFilename);
    await writeFile(filePath, file.buffer);
    return {
      message: 'Video uploaded successfully!',
      filename: customFilename
    };
  }
}