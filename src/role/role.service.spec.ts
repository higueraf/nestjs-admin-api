import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './role.service';
import { RunTestModule } from '../run-test/run-test.module';
import { RunTestService } from '../run-test/run-test.service';
import { Role } from './role.entity';

describe('RoleService', () => {
  let roleService: RoleService;
  let runTestService: RunTestService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...RunTestModule()],
      providers: [RoleService, RunTestService],
    }).compile();
    roleService = module.get<RoleService>(RoleService);
    runTestService = module.get<RunTestService>(RunTestService);
    await runTestService.createSeed(['User', 'Role']);
  });

  it('findAll', async () => {
    const roles = await roleService.findAll();
    expect(roles.data).toHaveLength(5);
  });

  it('findOne', async () => {
    const roleId = '7e57d004-2b97-4a2a-ab8e-eb0a7a58221f';
    const role = await roleService.findOne(roleId);
    expect(role).toBeDefined();
    expect(role.RoleID).toBe(roleId);
  });

  it('create', async () => {
    const newRole: Role = {
      RoleID: '7e57d004-2b97-4a2a-ab8e-eb0a7a58221f',
      Name: 'New Role',
      CreatedBy: '1b2a3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
      CreatedAt: new Date('2022-01-01T00:00:00.000Z'),
      UpdatedBy: '',
      UpdatedAt: undefined,
      DeletedBy: '',
      DeletedAt: undefined,
    };
    const createdRole = await roleService.create(newRole);
    expect(createdRole).toBeDefined();
    expect(createdRole.Name).toBe(newRole.Name);
  });

  it('update', async () => {
    const roleId = '7e57d004-2b97-4a2a-ab8e-eb0a7a58221f';
    const updatedData = { Name: 'Updated Description' };
    const updatedRole = await roleService.update(roleId, updatedData);
    expect(updatedRole).toBeDefined();
    expect(updatedRole.Name).toBe(updatedData.Name);
  });

  it('delete', async () => {
    const roleId = '7e57d004-2b97-4a2a-ab8e-eb0a7a58221f';
    const userId = '1b2a3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d';
    await roleService.delete(roleId, userId);
    const deletedRole = await roleService.findOne(roleId);
    expect(deletedRole).toBeDefined();
    expect(deletedRole.DeletedBy).toBe(userId);
    expect(deletedRole.DeletedAt).toBeDefined();
  });

  afterAll(async () => {
    await runTestService.clearDatabase();
  });
});
