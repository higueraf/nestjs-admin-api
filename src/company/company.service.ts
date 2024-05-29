import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindManyOptions, IsNull } from 'typeorm';
import { Company } from './company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CompanyUser } from './company-user.entity';
import { ResponseCreateCompanyDto } from './dto/response-create-company.dto';
import { UserCreateCompanyDto } from '../user/dto/user-create-company.dto';
import { User } from '../user/user.entity';
import { Subscription } from '../subscription/subscription.entity';
import { RoleService } from '../role/role.service';
import { UserSettingService } from '../user/user-setting.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { v4 as uuidv4 } from 'uuid';
import { ListResponseDto } from '../share/dto/list-response.dto';
import { UserSetting } from '../user/user-setting.entity';
import { Role } from '../role/role.entity';
import { UserService } from '../user/user.service';
import { PayloadUserDto } from '../auth/dto/payload-user.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(CompanyUser)
    private readonly companyUserRepository: Repository<CompanyUser>,
    @Inject(forwardRef(() => RoleService))
    private readonly roleService: RoleService,
    @Inject(forwardRef(() => SubscriptionService))
    private readonly subscriptionService: SubscriptionService,
    @Inject(forwardRef(() => UserSettingService))
    private readonly userSettingService: UserSettingService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<ListResponseDto> {
    const skip = (page - 1) * limit;
    const options: FindManyOptions<Company> = {
      skip,
      take: limit,
    };
    options.where = {
      DeletedBy: IsNull(),
    };
    if (search) {
      options.where.Name = Like(`%${search}%`);
    }
    const [data, totalCount] =
      await this.companyRepository.findAndCount(options);
    const listResponseDto: ListResponseDto = {
      data,
      totalCount,
    };
    return listResponseDto;
  }

  findOne(CompanyID: string): Promise<Company> {
    return this.companyRepository.findOne({ where: { CompanyID: CompanyID } });
  }

  async create(
    createCompanyDto: CreateCompanyDto,
    payloadUserDto: PayloadUserDto,
  ): Promise<ResponseCreateCompanyDto> {
    const queryRunner =
      this.companyRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const now = new Date();
      const company = await this.createCompanyInstance(
        createCompanyDto,
        now,
        payloadUserDto.uid,
      );
      await queryRunner.manager.save(company);
      const subscription = await this.createSubscriptionCompany(
        queryRunner.manager,
        company,
        createCompanyDto,
      );
      const newUser = await this.createUserCompany(
        queryRunner.manager,
        createCompanyDto.Owner,
        'Owner',
        company,
        payloadUserDto.uid,
      );
      const masterUser = await this.createUserCompany(
        queryRunner.manager,
        createCompanyDto.User,
        'Master',
        company,
        payloadUserDto.uid,
      );
      await queryRunner.commitTransaction();
      return this.createResponseDto(company, newUser, masterUser, subscription);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update(
    companyId: string,
    companyData: CreateCompanyDto,
  ): Promise<ResponseCreateCompanyDto> {
    const queryRunner =
      this.companyRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const company = await await this.companyRepository.findOne({
        where: { CompanyID: companyId },
      });
      if (!company) {
        throw new Error('Company not found');
      }
      company.Name = companyData.CompanyName;
      company.Address = companyData.Address;
      company.PhoneNumber = companyData.PhoneNumber;
      company.CountryID = companyData.CountryID;
      const masterUser = await this.findMasterUserByCompanyID(
        queryRunner.manager,
        company.CompanyID,
      );
      if (masterUser) {
        masterUser.Name = companyData.User.Name;
        masterUser.Email = companyData.User.Email;
        await queryRunner.manager.save(masterUser);
      }
      await queryRunner.manager.save(company);

      await queryRunner.commitTransaction();

      const responseCreateCompanyDto = new ResponseCreateCompanyDto();
      responseCreateCompanyDto.CompanyID = company.CompanyID;
      responseCreateCompanyDto.Name = company.Name;
      responseCreateCompanyDto.Address = company.Address;
      responseCreateCompanyDto.PhoneNumber = company.PhoneNumber;
      responseCreateCompanyDto.CountryID = company.CountryID;
      responseCreateCompanyDto.MasterUser = masterUser;

      return responseCreateCompanyDto;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async delete(
    companyId: string,
    payloadUserDto: PayloadUserDto,
  ): Promise<void> {
    const company: Company = await this.companyRepository.findOne({
      where: { CompanyID: companyId },
    });
    company.DeletedBy = payloadUserDto.uid;
    company.DeletedAt = new Date();
    await this.companyRepository.save(company);
  }

  countCompanies(): Promise<number> {
    return this.companyRepository.count();
  }

  private async createCompanyInstance(
    createCompanyDto: CreateCompanyDto,
    now: Date,
    createdBy: string,
  ): Promise<Company> {
    const { CompanyName, Address, PhoneNumber, CountryID } = createCompanyDto;
    const company = new Company();
    company.CompanyID = uuidv4();
    company.Name = CompanyName;
    company.Address = Address;
    company.PhoneNumber = PhoneNumber;
    company.CountryID = CountryID;
    company.CreatedBy = createdBy;
    company.CreatedAt = now;
    return company;
  }

  private async createUserCompany(
    manager,
    user: UserCreateCompanyDto,
    role: string,
    company: Company,
    createdBy: string,
  ): Promise<User> {
    const now = new Date();
    let newUser: User = await this.userService.findByEmail(user.Email);
    if (!newUser) {
      newUser = new User();
      newUser.UserID = uuidv4();
      newUser.Name = user.Name;
      newUser.Email = user.Email;
      newUser.CreatedBy = createdBy;
      newUser.CreatedAt = now;
      await manager.save(newUser);
    }
    const companyOwnerUser: CompanyUser = new CompanyUser();
    companyOwnerUser.CompanyUserID = uuidv4();
    companyOwnerUser.CompanyID = company.CompanyID;
    companyOwnerUser.UserID = newUser.UserID;
    await manager.save(companyOwnerUser);
    const roleFound: Role = await this.roleService.findByName(role);
    const newUserSetting: UserSetting = new UserSetting();
    newUserSetting.UserSettingID = uuidv4();
    newUserSetting.CompanyUserID = companyOwnerUser.CompanyUserID;
    newUserSetting.RoleID = roleFound.RoleID;
    await manager.save(newUserSetting);
    return newUser;
  }

  private async findMasterUserByCompanyID(
    manager,
    companyID: string,
  ): Promise<User | undefined> {
    const masterUser = await manager
      .createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .innerJoin('user.companyUsers', 'companyUser')
      .innerJoin('companyUser.role', 'role')
      .where('companyUser.companyID = :companyID', { companyID })
      .andWhere('role.name = :role', { role: 'Master' })
      .getOne();
    return masterUser;
  }

  private async createSubscriptionCompany(
    manager,
    company: Company,
    createCompanyDto: CreateCompanyDto,
  ): Promise<Subscription> {
    const now = new Date();
    const subscription: Subscription = new Subscription();
    subscription.SubscriptionID = uuidv4();
    subscription.CompanyID = company.CompanyID;
    subscription.StartDate = createCompanyDto.StartDate;
    subscription.EndDate = createCompanyDto.EndDate;
    subscription.Storage = createCompanyDto.Storage;
    subscription.SeatsQty = createCompanyDto.SeatsQty;
    subscription.IsUnlimitedGuests = createCompanyDto.IsUnlimitedGuests;
    subscription.PlanID = createCompanyDto.PlanID;
    subscription.IsActive = true;
    subscription.Price = 0;
    subscription.Reseller = '3e37b196-4f3f-4b3e-9a07-1b2479a92c58';
    subscription.CreatedBy = '511f5541-a566-4af3-bb7b-408da778bd42';
    subscription.CreatedAt = now;
    return await manager.save(subscription);
  }

  private createResponseDto(company, newUser, masterUser, subscription) {
    return {
      CompanyID: company.CompanyID,
      Name: company.Name,
      Address: company.Address,
      PhoneNumber: company.PhoneNumber,
      CountryID: company.CountryID,
      OwnerUser: newUser,
      MasterUser: masterUser,
      Subscription: subscription,
    };
  }
}
