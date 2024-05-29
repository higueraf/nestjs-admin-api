import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { Company } from '../company/company.entity';
import { CompanyUser } from '../company/company-user.entity';
import { Log } from 'src/log/log.entity';
import { LogService } from 'src/log/log.service';

@Module({
  controllers: [RoleController],
  imports: [TypeOrmModule.forFeature([Company, CompanyUser, Log, Role])],

  providers: [LogService, RoleService],
})
export class RoleModule {}
