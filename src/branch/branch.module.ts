import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Branch } from './branch.entity';
import { BranchService } from './branch.service';
import { BranchController } from './branch.controller';
import { BranchDepartmentController } from './branch-department.controller';
import { BranchDepartmentService } from './branch-department.service';
import { BranchDepartment } from './branch-department.entity';
import { LogService } from '../log/log.service';
import { Log } from '../log/log.entity';

@Module({
  controllers: [BranchController, BranchDepartmentController],
  imports: [TypeOrmModule.forFeature([Branch, BranchDepartment, Log])],
  providers: [BranchService, BranchDepartmentService, LogService],
})
export class BranchModule {}
