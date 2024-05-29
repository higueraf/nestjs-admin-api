import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Company } from '../company/company.entity';
import { Role } from '../role/role.entity';
import { Country } from '../country/country.entity';
import { CompanyUser } from '../company/company-user.entity';
import { Feature } from '../subscription/feature.entity';
import { Plan } from '../subscription/plan.entity';
import { PlanFeature } from '../subscription/plan-feature.entity';
import { CompanySetting } from '../company/company-setting.entity';
import { UserSetting } from '../user/user-setting.entity';
import { Branch } from '../branch/branch.entity';
import { BranchDepartment } from '../branch/branch-department.entity';
import { Subscription } from '../subscription/subscription.entity';
import { Log } from '../log/log.entity';
const entities = [
  Branch,
  BranchDepartment,
  Company,
  CompanyUser,
  CompanySetting,
  Country,
  Feature,
  Log,
  Plan,
  PlanFeature,
  Role,
  Subscription,
  User,
  UserSetting,
];
export const RunTestModule = () => [
  TypeOrmModule.forRoot({
    type: 'better-sqlite3',
    database: ':memory:',
    dropSchema: true,
    entities: entities,
    synchronize: true,
  }),
  TypeOrmModule.forFeature(entities),
];
