import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSetting } from './user-setting.entity';

@Injectable()
export class UserSettingService {
  constructor(
    @InjectRepository(UserSetting)
    private readonly userSettingRepository: Repository<UserSetting>,
  ) {}

  async findAll(): Promise<UserSetting[]> {
    return this.userSettingRepository.find();
  }

  async findOne(userSettingId: string): Promise<UserSetting> {
    const userSetting = await this.userSettingRepository.findOne({
      where: { UserSettingID: userSettingId },
    });
    if (!userSetting) {
      throw new NotFoundException(
        `UserSetting with ID "${userSettingId}" not found`,
      );
    }
    return userSetting;
  }
  async findByUserIDAndCompanyID(
    userID: string,
    companyID: string,
  ): Promise<UserSetting | null> {
    return await this.userSettingRepository.findOne({
      where: {
        companyUser: { UserID: userID, company: { CompanyID: companyID } },
      },
    });
  }

  async findByCompanyUserID(
    userCompanyID: string,
  ): Promise<UserSetting | null> {
    return await this.userSettingRepository.findOne({
      where: {
        CompanyUserID: userCompanyID,
      },
    });
  }

  async create(userSetting: Partial<UserSetting>): Promise<UserSetting> {
    return this.userSettingRepository.save(userSetting);
  }

  async update(
    userSettingId: string,
    updateUserSettingDto: Partial<UserSetting>,
  ): Promise<UserSetting> {
    const existingUserSetting = await this.findOne(userSettingId);
    const updatedUserSetting = {
      ...existingUserSetting,
      ...updateUserSettingDto,
    };
    return this.userSettingRepository.save(updatedUserSetting);
  }

  async updateByCompanyUserID(
    companyUserId: string,
    isConnected: boolean = false,
    token: string | null = null,
  ): Promise<UserSetting> {
    const existingUserSetting = await this.findByCompanyUserID(companyUserId);
    if (!existingUserSetting) {
      throw new Error('UserSetting not found');
    }
    existingUserSetting.IsConnected = isConnected;
    existingUserSetting.Token = token;
    return this.userSettingRepository.save(existingUserSetting);
  }

  async delete(userSettingId: string): Promise<void> {
    const userSetting = await this.findOne(userSettingId);
    await this.userSettingRepository.remove(userSetting);
  }
}
