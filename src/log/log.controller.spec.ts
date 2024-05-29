import { Test, TestingModule } from '@nestjs/testing';
import { LogController } from './log.controller';
import { LogService } from './log.service';
import { ListResponseDto } from '../share/dto/list-response.dto';
import { Log } from './log.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RunTestModule } from '../run-test/run-test.module';
import { RunTestService } from '../run-test/run-test.service';

describe('LogController', () => {
  let logController: LogController;
  let logService: LogService;
  let runTestService: RunTestService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...RunTestModule()],
      controllers: [LogController],
      providers: [LogService, RunTestService],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    logController = module.get<LogController>(LogController);
    logService = module.get<LogService>(LogService);
    runTestService = module.get<RunTestService>(RunTestService);

    await runTestService.createSeed(['Log']);
  });

  describe('findAll', () => {
    it('should return a list of logs', async () => {
      const expectedResult: ListResponseDto = { data: [], totalCount: 0 };
      jest.spyOn(logService, 'findAll').mockResolvedValueOnce(expectedResult);

      const result = await logController.findAll(1, 10, 'searchTerm');

      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a single log', async () => {
      const logId = 'loa05d3a6e-21f8-4991-9b71-c481027d2a2dgId';
      const expectedResult: Log = {} as Log;
      jest.spyOn(logService, 'findOne').mockResolvedValueOnce(expectedResult);

      const result = await logController.findOne(logId);

      expect(result).toEqual(expectedResult);
    });
  });

  afterAll(async () => {
    await runTestService.clearDatabase();
  });
});
