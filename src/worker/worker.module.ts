import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RolesService } from 'src/roles/roles.service';
import WorkerModel from './models/worker.model';
import { WorkerController } from './worker.controller';
import { WorkerService } from './worker.service';

@Module({
  imports: [
    WorkerModel,
    JwtModule,
  ],
  controllers: [WorkerController],
  providers: [RolesService, WorkerService]
})
export class WorkerModule {}
