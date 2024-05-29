import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, IsNull, Like, Repository } from 'typeorm';
import { BranchDepartment } from './branch-department.entity';
import { PayloadUserDto } from 'src/auth/dto/payload-user.dto';
import { uuid } from 'uuidv4';
import { ListResponseDto } from 'src/share/dto/list-response.dto';

@Injectable()
export class BranchDepartmentService {
  constructor(
    @InjectRepository(BranchDepartment)
    private readonly branchDepartmentRepository: Repository<BranchDepartment>,
  ) {}

  async findByBranchId(
    branchId: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<ListResponseDto> {
    const skip = (page - 1) * limit;
    const options: FindManyOptions<BranchDepartment> = {
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
      await this.branchDepartmentRepository.findAndCount(options);
    const listResponseDto: ListResponseDto = {
      data,
      totalCount,
    };
    return listResponseDto;
  }

  findOne(branchDepartmentId: string): Promise<BranchDepartment> {
    return this.branchDepartmentRepository.findOne({
      where: { BranchID: branchDepartmentId },
    });
  }

  create(
    branchDepartment: BranchDepartment,
    payloadUserDto: PayloadUserDto,
  ): Promise<BranchDepartment> {
    branchDepartment.BranchDepartmentID = uuid();
    branchDepartment.CreatedBy = payloadUserDto.uid;
    branchDepartment.CreatedAt = new Date();
    return this.branchDepartmentRepository.save(branchDepartment);
  }

  async update(
    branchDepartmentId: string,
    branchDepartment: BranchDepartment,
    payloadUserDto: PayloadUserDto,
  ): Promise<BranchDepartment> {
    branchDepartment.UpdatedBy = payloadUserDto.uid;
    branchDepartment.UpdatedAt = new Date();
    await this.branchDepartmentRepository.update(
      branchDepartmentId,
      branchDepartment,
    );
    return this.branchDepartmentRepository.findOne({
      where: { BranchDepartmentID: branchDepartmentId },
    });
  }

  async delete(
    branchDepartmentId: string,
    payloadUserDto: PayloadUserDto,
  ): Promise<void> {
    const branchDepartment: BranchDepartment =
      await this.branchDepartmentRepository.findOne({
        where: { BranchID: branchDepartmentId },
      });
    branchDepartment.DeletedBy = payloadUserDto.uid;
    branchDepartment.DeletedAt = new Date();
    await this.branchDepartmentRepository.save(branchDepartment);
  }
}
