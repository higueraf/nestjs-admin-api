import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesGuard } from './guards/roles.guard';
import { UserTokenService } from 'src/user/user-token.service';
import { UserToken } from 'src/user/user-token.entity';
import { UserSettingService } from 'src/user/user-setting.service';
import { UserSetting } from 'src/user/user-setting.entity';
import { NotificationService } from 'src/share/notification.service';
import { LogService } from 'src/log/log.service';
import { Log } from 'src/log/log.entity';
import { HttpModule } from '@nestjs/axios';
import { CompanyModule } from 'src/company/company.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '3600s' },
    }),
    TypeOrmModule.forFeature([Log, User, UserSetting, UserToken]),
    CompanyModule,
    HttpModule,
  ],
  providers: [
    JwtStrategy,
    AuthService,
    NotificationService,
    LogService,
    RolesGuard,
    UserService,
    UserSettingService,
    UserTokenService,
  ],
  controllers: [AuthController],
  exports: [RolesGuard],
})
export class AuthModule {}
