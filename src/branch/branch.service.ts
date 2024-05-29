import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, IsNull, Like, Repository } from 'typeorm';
import { Branch } from './branch.entity';
import { PayloadUserDto } from 'src/auth/dto/payload-user.dto';
import { uuid } from 'uuidv4';
import { ListResponseDto } from 'src/share/dto/list-response.dto';

@Injectable()
export class BranchService {
  constructor(
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
  ) {}
  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<ListResponseDto> {
    const skip = (page - 1) * limit;
    const options: FindManyOptions<Branch> = {
      skip,
      take: limit,
    };
    if (search) {
      options.where = {
        Name: Like(`%${search}%`),
        DeletedBy: IsNull(),
      };
    }
    const [data, totalCount] =
      await this.branchRepository.findAndCount(options);
    const listResponseDto: ListResponseDto = {
      data,
      totalCount,
    };
    return listResponseDto;
  }

  async findOne(branchId: string): Promise<Branch> {
    return await this.branchRepository.findOne({
      where: { BranchID: branchId },
    });
  }

  create(branch: Branch, payloadUserDto: PayloadUserDto): Promise<Branch> {
    branch.BranchID = uuid();
    branch.CompanyID = payloadUserDto.companyid;
    branch.CreatedBy = payloadUserDto.uid;
    branch.CreatedAt = new Date();
    return this.branchRepository.save(branch);
  }

  async update(
    branchId: string,
    branch: Partial<Branch>,
    payloadUserDto: PayloadUserDto,
  ): Promise<Branch> {
    const updatedBranch: Partial<Branch> = {
      ...branch,
      UpdatedBy: payloadUserDto.uid,
      UpdatedAt: new Date(),
    };
    await this.branchRepository.update(branchId, updatedBranch);
    return await this.branchRepository.findOne({
      where: { BranchID: branchId },
    });
  }

  async delete(
    branchId: string,
    payloadUserDto: PayloadUserDto,
  ): Promise<void> {
    const branch: Branch = await this.branchRepository.findOne({
      where: { BranchID: branchId },
    });
    branch.DeletedBy = payloadUserDto.uid;
    branch.DeletedAt = new Date();
    await this.branchRepository.save(branch);
  }
}
