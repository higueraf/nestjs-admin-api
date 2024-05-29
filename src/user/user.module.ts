import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { Company } from '../company/company.entity';
import { CompanyUser } from '../company/company-user.entity';
import { UserSettingService } from './user-setting.service';
import { Role } from '../role/role.entity';
import { UserSetting } from './user-setting.entity';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';
import { CompanyService } from '../company/company.service';
import { Branch } from '../branch/branch.entity';
import { BranchDepartment } from '../branch/branch-department.entity';
import { RoleService } from '../role/role.service';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { Subscription } from 'rxjs';
import { RoleModule } from '../role/role.module';
import { LogService } from 'src/log/log.service';
import { Log } from 'src/log/log.entity';
import { NotificationService } from 'src/share/notification.service';
import { HttpModule } from '@nestjs/axios';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserTokenService } from './user-token.service';
import { UserToken } from './user-token.entity';

@Module({
  controllers: [UserController],
  imports: [
    TypeOrmModule.forFeature([
      Branch,
      BranchDepartment,
      Company,
      CompanyUser,
      Log,
      Role,
      Subscription,
      User,
      UserSetting,
      UserToken,
    ]),
    AuthModule,
    HttpModule,
    JwtModule,
    RoleModule,
  ],
  providers: [
    AuthService,
    CompanyService,
    JwtService,
    LogService,
    NotificationService,
    RoleService,
    SubscriptionService,
    UserService,
    UserSettingService,
    UserTokenService,
  ],
  exports: [
    CompanyService,
    RoleService,
    SubscriptionService,
    UserService,
    UserSettingService,
  ],
})
export class UserModule {}
