import { Controller, Get, Post, Body, Patch, Param, Delete, Query  } from '@nestjs/common';
import { SolutionService } from './solution.service';

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
}
