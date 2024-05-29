import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '../company/company.entity';
import { Role } from '../role/role.entity';
import { User } from '../user/user.entity';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { Country } from '../country/country.entity';
import { Feature } from '../subscription/feature.entity';
import { Plan } from '../subscription/plan.entity';
import { PlanFeature } from '../subscription/plan-feature.entity';
import { HttpModule } from '@nestjs/axios';
import { NotificationService } from './notification.service';

@Module({
  controllers: [SeedController],
  imports: [
    TypeOrmModule.forFeature([
      Company,
      Country,
      Feature,
      Plan,
      PlanFeature,
      Role,
      User,
    ]),
    HttpModule,
  ],
  providers: [SeedService, NotificationService],
})
export class ShareModule {}
