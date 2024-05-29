import { Test, TestingModule } from '@nestjs/testing';
import { BranchService } from './branch.service';
import { RunTestModule } from '../run-test/run-test.module';
import { RunTestService } from '../run-test/run-test.service';
import { Branch } from './branch.entity';
import { PayloadUserDto } from 'src/auth/dto/payload-user.dto';

describe('BranchService', () => {
  let branchService: BranchService;
  let runTestService: RunTestService;
  let payloadUserDto: PayloadUserDto;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...RunTestModule()],
      providers: [BranchService, RunTestService],
    }).compile();
    branchService = module.get<BranchService>(BranchService);
    runTestService = module.get<RunTestService>(RunTestService);
    await runTestService.createSeed(['User', 'Branch']);
    payloadUserDto = {
      name: 'John Doe',
      title: 'Manager',
      uid: 'a4b2f7a5-6f34-4f58-bcec-842d23d41cac',
      company: 'Example Company',
      companyid: '3e37b196-4f3f-4b3e-9a07-1b2479a92c58',
      email: 'john.doe@example.com',
      istrial: 'false',
      dateend: '2024-12-31',
      role: 'Admin',
      candownload: 1,
      nbf: '1619152921',
      exp: '1619156521',
      iat: '1619152921',
      iss: 'example.com',
      aud: 'example.com',
    };
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await runTestService.clearDatabase();
  });

  it('should be defined', () => {
    expect(branchService).toBeDefined();
  });

  it('findAll', async () => {
    const result = await branchService.findAll(payloadUserDto);
    expect(result.length).toEqual(5);
  });

  it('findOne', async () => {
    const branchId = 'd7a1ab58-7b2b-43c5-95e0-c9d7f5e4ffea';
    const result = await branchService.findOne(branchId);
    expect(result.BranchID).toEqual(branchId);
  });

  it('create', async () => {
    const newBranch: Branch = {
      BranchID: '3f2504e0-4f89-11e9-9f0c-4d2b9b61d07d',
      Name: 'Sucursal A',
      CompanyID: 'companyid',
      CreatedBy: 'userid',
      CreatedAt: new Date('2024-04-23T08:00:00.000Z'),
      UpdatedBy: null,
      UpdatedAt: null,
      DeletedBy: null,
      DeletedAt: null,
    };

    const result = await branchService.create(newBranch, payloadUserDto);
    expect(result).toEqual(newBranch);
  });

  it('should update branch', async () => {
    const branchId = 'd7a1ab58-7b2b-43c5-95e0-c9d7f5e4ffea';
    const partialBranch: Partial<Branch> = {
      Name: 'New Branch Name',
    };
    const updatedBranch = await branchService.update(
      branchId,
      partialBranch,
      payloadUserDto,
    );
    expect(updatedBranch).toBeDefined();
    expect(updatedBranch.Name).toBe('New Branch Name');
  });

  it('delete', async () => {
    const branchId = 'd7a1ab58-7b2b-43c5-95e0-c9d7f5e4ffea';
    await branchService.delete(branchId, payloadUserDto);
    const result = await branchService.findOne(branchId);
    expect(result.DeletedBy).toBe(payloadUserDto.uid);
    expect(result.DeletedAt).toBeDefined();
  });
});
