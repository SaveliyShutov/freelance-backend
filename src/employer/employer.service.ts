import { Injectable } from '@nestjs/common';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class EmployerService {
  constructor(
    private RolesService: RolesService
  ) {}


}
