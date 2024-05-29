import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { CompanyService } from './company.service';
import { CompanyUser } from './company-user.entity';
import { CompanyController } from './company.controller';
import { RoleService } from '../role/role.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { UserService } from '../user/user.service';
import { UserSettingService } from '../user/user-setting.service';
import { Role } from '../role/role.entity';
import { Subscription } from '../subscription/subscription.entity';
import { User } from '../user/user.entity';
import { UserSetting } from '../user/user-setting.entity';
import { UserTokenService } from 'src/user/user-token.service';
import { UserToken } from 'src/user/user-token.entity';
import { LogService } from 'src/log/log.service';
import { Log } from 'src/log/log.entity';
import { ShareModule } from 'src/share/share.module';
import { NotificationService } from 'src/share/notification.service';
import { HttpModule } from '@nestjs/axios';
import { AuthService } from 'src/auth/auth.service';

@Module({
  controllers: [CompanyController],
  imports: [
    TypeOrmModule.forFeature([
      Company,
      CompanyUser,
      Log,
      Role,
      Subscription,
      User,
      UserSetting,
      UserToken,
    ]),
    HttpModule,
    ShareModule,
  ],
  providers: [
    AuthService,
    CompanyService,
    LogService,
    NotificationService,
    RoleService,
    SubscriptionService,
    UserService,
    UserSettingService,
    UserTokenService,
  ],
  exports: [CompanyService, RoleService],
})
export class CompanyModule {}
