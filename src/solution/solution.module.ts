import { Module } from '@nestjs/common';
import { SolutionService } from './solution.service';
import { SolutionController } from './solution.controller';
import SolutionModel from './models/solution.model';

@Module({
  imports: [SolutionModel],
  controllers: [SolutionController],
  providers: [SolutionService],
})
export class SolutionModule {}
