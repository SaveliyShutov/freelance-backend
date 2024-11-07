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
  async uploadFolder(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('solution_id') solutionId: string
  ) {
    const fileNames = files.map(file => {
      let spl = file.destination.split('/');
      spl.splice(0, 1)
      return spl.join('/')
    });

    // there is one folder
    return await this.SolutionModel.findByIdAndUpdate(solutionId, { folderPath: fileNames[0] })
  }

  @Post('upload/archives')
  @UseInterceptors(FilesInterceptor('files', 10)) // 'files' is the form field name, max 10 files
  async uploadArchives(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('solution_id') solutionId: string) {
    const fileNames = files.map(file => {
      let spl = file.path.split('/');
      spl.splice(0, 1) // path is public/solutions/..., we dont need public in out path
      return spl.join('/')
    });

    return await this.SolutionModel.findByIdAndUpdate(solutionId, { archives: fileNames })
  }

  @Post('upload/any-files')
  @UseInterceptors(FilesInterceptor('files', 40)) // 'files' is the form field name, max 40 files
  async uploadAnyFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('solution_id') solutionId: string) {
    const fileNames = files.map(file => {
      let spl = file.path.split('/');
      spl.splice(0, 1) // path is public/solutions/..., we dont need public in out path
      return spl.join('/')
    });

    return await this.SolutionModel.findByIdAndUpdate(solutionId, { anyFiles: fileNames })
  }

  @Post('upload/code')
  @UseInterceptors(FilesInterceptor('files', 40)) // 'files' is the form field name, max 40 files
  async uploadCode(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('solution_id') solutionId: string) {
    const fileNames = files.map(file => {
      let spl = file.path.split('/');
      spl.splice(0, 1) // path is public/solutions/..., we dont need public in out path
      return spl.join('/')
    });
    return await this.SolutionModel.findByIdAndUpdate(solutionId, { code: fileNames })
  }
}
