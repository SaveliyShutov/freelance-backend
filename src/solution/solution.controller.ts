import { Controller, Get, Post, Body, Patch, Param, UploadedFile, HttpCode, Delete, Query, HttpStatus, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { SolutionService } from './solution.service';

import { FilesInterceptor } from '@nestjs/platform-express';

// all about MongoDB
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SolutionClass } from './schemas/solution.schema';

@Controller('solution')
export class SolutionController {
  constructor(
    @InjectModel('Solution') private SolutionModel: Model<SolutionClass>,
    private readonly solutionService: SolutionService) { }

  @Post('')
  async newSolution(
    @Body('solution') solution: any
  ) {
    return await this.SolutionModel.create(solution)
  }

  @Post('upload/folder')
  @UseInterceptors(FilesInterceptor('files', 100)) // 'files' is the form field name, max 100 files
  uploadFolder(@UploadedFiles() files: Express.Multer.File[]) {
    const fileNames = files.map(file => file.filename);
    // console.log(files);
    
    return {
      message: 'Files uploaded successfully',
      files: fileNames,
    };
  }

  @Post('upload/archives')
  @UseInterceptors(FilesInterceptor('files', 10)) // 'files' is the form field name, max 10 files
  uploadArchives(@UploadedFiles() files: Express.Multer.File[]) {
    const fileNames = files.map(file => file.filename);
    return {
      message: 'Files uploaded successfully',
      files: fileNames,
    };
  }

  @Post('upload/any-files')
  @UseInterceptors(FilesInterceptor('files', 40)) // 'files' is the form field name, max 40 files
  uploadAnyFiles(@UploadedFiles() files: Express.Multer.File[]) {
    const fileNames = files.map(file => file.filename);
    return {
      message: 'Files uploaded successfully',
      files: fileNames,
    };
  }

  @Post('upload/code')
  @UseInterceptors(FilesInterceptor('files', 40)) // 'code' is the form field name, max 40 files
  uploadCode(@UploadedFiles() files: Express.Multer.File[]) {    
    const fileNames = files.map(file => file.filename);
    return {
      message: 'Files uploaded successfully',
      files: fileNames,
    };
  }
}
