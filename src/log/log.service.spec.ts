import { Test, TestingModule } from '@nestjs/testing';
import { LogService } from './log.service';
import { RunTestModule } from '../run-test/run-test.module';
import { Log } from './log.entity';
import { ListResponseDto } from '../share/dto/list-response.dto';
import { RunTestService } from '../run-test/run-test.service';
import { v4 as uuidv4 } from 'uuid';

describe('LogService', () => {
  let logService: LogService;
  let runTestService: RunTestService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...RunTestModule()],
      providers: [LogService, RunTestService],
    }).compile();
    logService = module.get<LogService>(LogService);
    runTestService = module.get<RunTestService>(RunTestService);
    await runTestService.createSeed(['Log']);
  });

  it('findAll', async () => {
    const logs: ListResponseDto = await logService.findAll();
    expect(logs.data).toBeDefined();
    expect(Array.isArray(logs.data)).toBeTruthy();
    expect(logs.data.length).toBeGreaterThanOrEqual(0);
    expect(logs.totalCount).toBeDefined();
    expect(typeof logs.totalCount).toBe('number');
    expect(logs.totalCount).toBeGreaterThanOrEqual(0);
  });

  it('findOne', async () => {
    const logId = 'e5b79379-4a18-4b4e-af1e-b6b812b9d2e0';
    const log: Log = await logService.findOne(logId);
    expect(log).toBeDefined();
    expect(log.LogID).toBe(logId);
  });

  it('create', async () => {
    const newLog: Log = {
      LogID: uuidv4(),
      DateTime: new Date(),
      UserID: uuidv4(),
      UserName: 'user3',
      Microservice: 'microservice3',
      EventMessage: 'Event message 3',
      EventMethod: 'Event method 3',
      ErrorMessage: 'Error message 3',
      CompanyID: uuidv4(),
      CompanyName: 'Company 3',
    };
    const createdLog: void = await logService.create(newLog, null);
    expect(createdLog).toBeDefined();
  });

  afterAll(async () => {
    await runTestService.clearDatabase();
  });
});
