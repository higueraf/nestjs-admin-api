import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyUser } from './company-user.entity';

@Injectable()
export class CompanyUserService {
  constructor(
    @InjectRepository(CompanyUser)
    private readonly companyUserRepository: Repository<CompanyUser>,
  ) {}

  async findByCompanyUserID(
    companyUserID: string,
  ): Promise<CompanyUser | undefined> {
    return await this.companyUserRepository.findOne({
      where: { CompanyUserID: companyUserID },
    });
  }

  async findByUserID(userID: string): Promise<CompanyUser | undefined> {
    return await this.companyUserRepository.findOne({
      where: { UserID: userID },
    });
  }
  async findByCompanyIDAndUserID(
    companyId: string,
    userId: string,
  ): Promise<CompanyUser | undefined> {
    return await this.companyUserRepository.findOne({
      where: { CompanyID: companyId, UserID: userId },
    });
  }
}
