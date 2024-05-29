import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { RunTestService } from './run-test/run-test.service';
import { CompanyService } from './company/company.service';
import { RunTestModule } from './run-test/run-test.module';
import { RoleService } from './role/role.service';
import { SubscriptionService } from './subscription/subscription.service';
import { UserService } from './user/user.service';
import { UserSettingService } from './user/user-setting.service';

describe('AppService', () => {
  let appService: AppService;
  let runTestService: RunTestService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...RunTestModule()],
      providers: [
        AppService,
        CompanyService,
        RoleService,
        SubscriptionService,
        UserService,
        UserSettingService,
        RunTestService,
      ],
    }).compile();
    appService = module.get<AppService>(AppService);
    runTestService = module.get<RunTestService>(RunTestService);
    await runTestService.createSeed(['User', 'Country', 'Company']);
  });

  it('testEnv', async () => {
    const result = await appService.testEnv();
    expect(result.testSQLServer).toEqual('OK');
  });
});
