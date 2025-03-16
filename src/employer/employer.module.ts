import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RolesService } from 'src/roles/roles.service';
import EmployerModel from './models/employer.model';
import { EmployerController } from './employer.controller';
import { EmployerService } from './employer.service';

@Module({
  imports: [
    EmployerModel,
    JwtModule,
  ],
  controllers: [EmployerController],
  providers: [RolesService, EmployerService]
})
export class EmployerModule {}
