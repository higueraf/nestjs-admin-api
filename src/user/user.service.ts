import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyOptions,
  IsNull,
  Like,
  QueryRunner,
  Repository,
} from 'typeorm';
import { User } from './user.entity';
import { ListResponseDto } from '../share/dto/list-response.dto';
import { v4 as uuidv4 } from 'uuid';
import { PayloadUserDto } from 'src/auth/dto/payload-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { CompanyUser } from 'src/company/company-user.entity';
import { UserSetting } from './user-setting.entity';
import { CompanyService } from 'src/company/company.service';
import { NotificationService } from 'src/share/notification.service';
import {
  RecipientDto,
  CreateNotificationDto,
} from 'src/share/dto/create-notification.dto';
import { NotificationTypeEnum } from 'src/share/enum/notification-type.enum';
import { SendTypeEnum } from 'src/share/enum/send-type.enum';
import { AuthService } from 'src/auth/auth.service';
import { TokenExpirationEnum } from 'src/auth/tokenexpiration.enum';
import { SetPasswordDto } from './dto/set-password.dto';
import * as bcrypt from 'bcrypt';
import { CompanyUserService } from 'src/company/company-user.service';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => CompanyService))
    private readonly companyService: CompanyService,
    @Inject(forwardRef(() => CompanyUserService))
    private readonly companyUserService: CompanyUserService,
    @Inject(forwardRef(() => NotificationService))
    private readonly notificationService: NotificationService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<ListResponseDto> {
    const skip = (page - 1) * limit;
    const options: FindManyOptions<User> = {
      skip,
      take: limit,
    };
    if (search) {
      options.where = {
        Name: Like(`%${search}%`),
        DeletedBy: IsNull(),
      };
    }
    const [data, totalCount] = await this.userRepository.findAndCount(options);
    const listResponseDto: ListResponseDto = {
      data,
      totalCount,
    };
    return listResponseDto;
  }

  async findOne(userID: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { UserID: userID, DeletedBy: IsNull() },
      relations: ['companyUsers', 'companyUsers.userSetting'],
    });
  }

  async findOneByCompany(
    userID: string,
    companyID: string,
  ): Promise<User | null> {
    return await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.companyUsers', 'companyUsers')
      .leftJoinAndSelect('companyUsers.userSettings', 'userSettings')
      .where('user.UserID = :userID', { userID })
      .andWhere('user.DeletedBy IS NULL')
      .andWhere('companyUsers.CompanyID = :companyID', { companyID })
      .getOne();
  }

  async create(
    createUserDto: CreateUserDto,
    payloadUserDto: PayloadUserDto,
  ): Promise<User> {
    const queryRunner =
      this.userRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const createUser = await this.createUser(
        createUserDto,
        payloadUserDto,
        queryRunner,
      );
      const companyUser = await this.createCompanyUser(
        createUser.user,
        payloadUserDto,
        queryRunner,
      );
      await this.createUserSetting(companyUser, createUserDto, queryRunner);
      await queryRunner.commitTransaction();
      try {
        await this.sendNotificationNewUser(companyUser, createUser.invite);
      } catch (error) {
        console.log(error);
        await queryRunner.rollbackTransaction();
      }
      const user: User = await this.findOneByCompany(
        createUser.user.UserID,
        companyUser.CompanyID,
      );
      return user;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async createUser(
    createUserDto: CreateUserDto,
    payloadUserDto: PayloadUserDto,
    queryRunner: QueryRunner,
  ): Promise<{ user: User; invite: boolean }> {
    let user: User = await this.findByEmail(createUserDto.Email);
    let invite = false;
    if (!user) {
      user = new User();
      user.UserID = uuidv4();
      user.Username = user.Email;
      user.Name = createUserDto.Name;
      user.Email = createUserDto.Email;
      user.CreatedBy = payloadUserDto.uid;
      user.CreatedAt = new Date();
      await queryRunner.manager.save(user);
    } else {
      invite = true;
    }
    return { user: user, invite: invite };
  }

  private async createCompanyUser(
    user: User,
    payloadUserDto: PayloadUserDto,
    queryRunner: QueryRunner,
  ): Promise<CompanyUser> {
    const company = await this.companyService.findOne(payloadUserDto.companyid);
    if (!company) {
      throw new Error('Company not found');
    }
    const companyUser = new CompanyUser();
    companyUser.CompanyUserID = uuidv4();
    companyUser.CompanyID = company.CompanyID;
    companyUser.UserID = user.UserID;
    return await queryRunner.manager.save(companyUser);
  }

  private async createUserSetting(
    companyUser: CompanyUser,
    createUserDto: CreateUserDto,
    queryRunner: QueryRunner,
  ): Promise<void> {
    const userSetting = new UserSetting();
    userSetting.UserSettingID = uuidv4();
    userSetting.CompanyUserID = companyUser.CompanyUserID;
    userSetting.CanDownload = createUserDto.CanDownload;
    userSetting.RoleID = createUserDto.RoleID;
    userSetting.IsActive = true;
    await queryRunner.manager.save(userSetting);
  }
  private async sendNotificationNewUser(
    companyUser: CompanyUser,
    invite: boolean,
  ): Promise<void> {
    const createNotificationDto = new CreateNotificationDto();
    createNotificationDto.CompanyUserID = companyUser.CompanyUserID;
    createNotificationDto.UserID = companyUser.UserID;
    createNotificationDto.CompanyName = companyUser?.company?.companySetting
      ?.UseCompanyName
      ? companyUser.company.Name
      : null;
    createNotificationDto.NotificationType = invite
      ? NotificationTypeEnum.NEW_USER
      : NotificationTypeEnum.MULTI_USER;
    createNotificationDto.SendType = [SendTypeEnum.EMAIL];
    const recipientDto: RecipientDto = new RecipientDto();
    recipientDto.Name = companyUser.user.Name;
    recipientDto.Email = companyUser.user.Email;
    recipientDto.CompanyUserID = companyUser.CompanyUserID;
    recipientDto.UserID = companyUser.UserID;
    createNotificationDto.Recipients = [recipientDto];
    const payloadUserDto: PayloadUserDto = new PayloadUserDto();
    payloadUserDto.name = companyUser.user.Name;
    payloadUserDto.title = companyUser.user.Title;
    payloadUserDto.uid = companyUser.user.UserID;
    payloadUserDto.companyuserid = companyUser.CompanyUserID;
    payloadUserDto.company = companyUser.company.Name;
    payloadUserDto.companyid = companyUser.CompanyID;
    payloadUserDto.email = companyUser.user.Email;
    payloadUserDto.role = companyUser.userSettings[0].role.Name;
    payloadUserDto.candownload = companyUser.userSettings[0].CanDownload
      ? '1'
      : '0';

    createNotificationDto.Parameters = [
      {
        Key: 'UserName',
        Value: companyUser.user.Name,
      },
      {
        Key: 'UserEmail',
        Value: companyUser.user.Email,
      },
      {
        Key: 'Token',
        Value: await this.authService.encodeToken(
          payloadUserDto,
          TokenExpirationEnum.Day,
        ),
      },
      {
        Key: 'DomainName',
        Value: process.env.DOMAIN_NAME,
      },
    ];
    await this.notificationService.send(createNotificationDto);
  }

  async update(
    userId: string,
    user: Partial<User>,
    payloadUserDto: PayloadUserDto,
  ): Promise<User> {
    const updatedBranch: Partial<User> = {
      ...user,
      UpdatedBy: payloadUserDto.uid,
      UpdatedAt: new Date(),
    };
    await this.userRepository.update(userId, updatedBranch);
    return await this.userRepository.findOne({
      where: { UserID: userId },
    });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: { Email: email },
      relations: [
        'companyUsers',
        'companyUsers.company',
        'companyUsers.userSettings',
        'companyUsers.userSettings.role',
      ],
    });
  }

  async findByFilter(filter: any) {
    return await this.userRepository.findOneBy(filter);
  }
  async delete(userId: string, payloadUserDto: PayloadUserDto): Promise<void> {
    const user: User = await this.findOne(userId);
    user.DeletedBy = payloadUserDto.uid;
    user.DeletedAt = new Date();
    await this.userRepository.save(user);
  }

  async setPassword(
    setPasswordDto: SetPasswordDto,
    payloadUserDto: PayloadUserDto,
  ): Promise<User> {
    const user: User = await this.findOne(payloadUserDto.uid);
    user.Password = await bcrypt.hash(setPasswordDto.Password, 10);
    user.UpdatedAt = new Date();
    user.UpdatedBy = payloadUserDto.uid;
    const companyUser: CompanyUser =
      await this.companyUserService.findByCompanyIDAndUserID(
        payloadUserDto.companyid,
        payloadUserDto.uid,
      );
    await this.sendNotificationAccountActive(companyUser);
    return await this.userRepository.save(user);
  }

  private async sendNotificationAccountActive(
    companyUser: CompanyUser,
  ): Promise<void> {
    const createNotificationDto = new CreateNotificationDto();
    createNotificationDto.CompanyUserID = companyUser.CompanyUserID;
    createNotificationDto.UserID = companyUser.UserID;
    createNotificationDto.CompanyName = companyUser?.company?.companySetting
      ?.UseCompanyName
      ? companyUser.company.Name
      : null;
    createNotificationDto.NotificationType =
      NotificationTypeEnum.ACCOUNT_ACTIVE;
    createNotificationDto.SendType = [SendTypeEnum.EMAIL];
    const recipientDto: RecipientDto = new RecipientDto();
    recipientDto.Name = companyUser.user.Name;
    recipientDto.Email = companyUser.user.Email;
    recipientDto.CompanyUserID = companyUser.CompanyUserID;
    recipientDto.UserID = companyUser.UserID;
    createNotificationDto.Recipients = [recipientDto];
    createNotificationDto.Parameters = [
      {
        Key: 'UserName',
        Value: companyUser.user.Name,
      },
      {
        Key: 'UserEmail',
        Value: companyUser.user.Email,
      },
      {
        Key: 'DomainName',
        Value: process.env.DOMAIN_NAME,
      },
    ];
    await this.notificationService.send(createNotificationDto);
  }
}
