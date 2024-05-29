import { Test, TestingModule } from '@nestjs/testing';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { ListResponseDto } from '../share/dto/list-response.dto';
import { Role } from './role.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RunTestModule } from '../run-test/run-test.module';
import { RunTestService } from '../run-test/run-test.service';

describe('RoleController', () => {
  let roleController: RoleController;
  let roleService: RoleService;
  let runTestService: RunTestService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...RunTestModule()],
      controllers: [RoleController],
      providers: [RoleService, RunTestService],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    roleController = module.get<RoleController>(RoleController);
    roleService = module.get<RoleService>(RoleService);
    runTestService = module.get<RunTestService>(RunTestService);

    await runTestService.createSeed(['User', 'Role']);
  });

  describe('findAll', () => {
    it('should return a list of roles', async () => {
      const expectedResult: ListResponseDto = { data: [], totalCount: 0 };
      jest.spyOn(roleService, 'findAll').mockResolvedValueOnce(expectedResult);
      const result = await roleController.findAll(null, 1, 10, 'searchTerm');
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a single role', async () => {
      const roleId = 'roleId';
      const expectedResult: Role = {} as Role;
      jest.spyOn(roleService, 'findOne').mockResolvedValueOnce(expectedResult);

      const result = await roleController.findOne(roleId);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('create', () => {
    it('should create a new role', async () => {
      const newRole: Role = {} as Role;
      const expectedResult: Role = {} as Role;
      jest.spyOn(roleService, 'create').mockResolvedValueOnce(expectedResult);

      const result = await roleController.create(newRole);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should update an existing role', async () => {
      const roleId = 'roleId';
      const updatedRole: Role = {} as Role;
      const expectedResult: Role = {} as Role;
      jest.spyOn(roleService, 'update').mockResolvedValueOnce(expectedResult);

      const result = await roleController.update(roleId, updatedRole);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('delete', () => {
    it('should delete an existing role', async () => {
      const roleId = 'roleId';
      jest.spyOn(roleService, 'delete').mockResolvedValueOnce();

      const result = await roleController.delete(roleId);

      expect(result).toBeUndefined();
    });
  });

  afterAll(async () => {
    await runTestService.clearDatabase();
  });
});
