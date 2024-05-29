import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoleModule } from './role/role.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { Branch } from './branch/branch.entity';
import { BranchDepartment } from './branch/branch-department.entity';
import { Company } from './company/company.entity';
import { Country } from './country/country.entity';
import { CompanyUser } from './company/company-user.entity';
import { Feature } from './subscription/feature.entity';
import { Plan } from './subscription/plan.entity';
import { PlanFeature } from './subscription/plan-feature.entity';
import { Role } from './role/role.entity';
import { User } from './user/user.entity';
import { CompanyModule } from './company/company.module';
import { CountryModule } from './country/country.module';
import { ShareModule } from './share/share.module';
import { CompanyService } from './company/company.service';
import { BranchModule } from './branch/branch.module';
import { Subscription } from 'rxjs';
import { RoleService } from './role/role.service';
import { SubscriptionService } from './subscription/subscription.service';
import { UserSetting } from './user/user-setting.entity';
import { LogModule } from './log/log.module';
import { Log } from './log/log.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}`],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mssql',
        host: process.env.MSSQL_HOST,
        port: parseInt(process.env.MSSQL_PORT, 10),
        username: process.env.MSSQL_USER,
        password: process.env.MSSQL_PASSWORD,
        database: process.env.MSSQL_DATABASE,
        entities: [__dirname + '/**/*.entity.{js,ts}'],
        synchronize: false,
        migrationsRun: false,
        migrations: ['dist/migrations/*.js'],
      }),
    }),
    TypeOrmModule.forFeature([
      Branch,
      BranchDepartment,
      Company,
      CompanyUser,
      Country,
      Feature,
      Log,
      Plan,
      PlanFeature,
      Role,
      Subscription,
      User,
      UserSetting,
    ]),
    AuthModule,
    BranchModule,
    CompanyModule,
    CountryModule,
    LogModule,
    RoleModule,
    ShareModule,
    Subscription,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, CompanyService, RoleService, SubscriptionService],
})
export class AppModule {}
