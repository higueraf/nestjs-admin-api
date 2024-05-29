import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { RunTestModule } from '../run-test/run-test.module';
import { RunTestService } from '../run-test/run-test.service';
import { User } from './user.entity';
import { RoleService } from '../role/role.service';

describe('UserService', () => {
  let userService: UserService;
  let runTestService: RunTestService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...RunTestModule()],
      providers: [UserService, RoleService, RunTestService],
    }).compile();
    userService = module.get<UserService>(UserService);
    runTestService = module.get<RunTestService>(RunTestService);
    await runTestService.createSeed(['User']);
  });

  it('findAll', async () => {
    const users = await userService.findAll();
    expect(users.data).toHaveLength(5);
  });

  it('findOne', async () => {
    const user = await userService.findOne(
      '511f5541-a566-4af3-bb7b-408da778bd42',
    );
    expect(user).toBeDefined();
    expect(user.UserID).toBe('511f5541-a566-4af3-bb7b-408da778bd42');
  });

  it('create', async () => {
    const newUser: User = {
      UserID: '511f5541-a566-4af3-bb7b-408da778bd55',
      Name: 'New User',
      Username: 'newuser',
      Password: 'password',
      Email: 'newuser@example.com',
      Address: 'New Address',
      PhoneNumber: '1234567890',
      Title: 'Eng.',
      CreatedBy: null,
      CreatedAt: null,
      UpdatedBy: null,
      UpdatedAt: null,
      DeletedBy: null,
      DeletedAt: null,
      companyUsers: [],
    };

    const createdUser = await userService.create(newUser);
    expect(createdUser).toBeDefined();
    expect(createdUser.Name).toBe(newUser.Name);
  });

  it('update', async () => {
    const userId = '511f5541-a566-4af3-bb7b-408da778bd55';
    const updatedData = { Name: 'Updated Name' };
    const updatedUser = await userService.update(userId, updatedData);
    expect(updatedUser).toBeDefined();
    expect(updatedUser.Name).toBe(updatedData.Name);
  });

  it('findByEmail', async () => {
    const userEmail = 'user1@example.com';
    const user = await userService.findByEmail(userEmail);
    expect(user).toBeDefined();
    expect(user.Email).toBe(userEmail);
  });

  it('findByFilter', async () => {
    const filter = { Username: 'user2' };
    const user = await userService.findByFilter(filter);
    expect(user).toBeDefined();
    expect(user.Username).toBe(filter.Username);
  });

  afterAll(async () => {
    await runTestService.clearDatabase();
  });
});
