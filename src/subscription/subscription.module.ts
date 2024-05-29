import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './subscription.entity';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { Company } from '../company/company.entity';
import { CompanyUser } from '../company/company-user.entity';
import { LogService } from '../log/log.service';
import { Log } from '../log/log.entity';

@Module({
  controllers: [SubscriptionController],
  imports: [
    TypeOrmModule.forFeature([Company, CompanyUser, Log, Subscription]),
  ],
  providers: [SubscriptionService, LogService],
})
export class SubscriptionModule {}
