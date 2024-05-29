import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, IsNull, Like, Repository } from 'typeorm';
import { Role } from './role.entity';
import { PayloadUserDto } from 'src/auth/dto/payload-user.dto';
import { uuid } from 'uuidv4';
import { ListResponseDto } from 'src/share/dto/list-response.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}
  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<ListResponseDto> {
    const skip = (page - 1) * limit;
    const options: FindManyOptions<Role> = {
      skip,
      take: limit,
    };
    if (search) {
      options.where = {
        Name: Like(`%${search}%`),
        DeletedBy: IsNull(),
      };
    }
    const [data, totalCount] = await this.roleRepository.findAndCount(options);
    const listResponseDto: ListResponseDto = {
      data,
      totalCount,
    };
    return listResponseDto;
  }

  async findOne(roleId: string): Promise<Role> {
    return await this.roleRepository.findOne({
      where: { RoleID: roleId },
    });
  }

  async findByName(name: string): Promise<Role> {
    return await this.roleRepository.findOne({
      where: { Name: name, DeletedBy: IsNull() },
    });
  }

  create(role: Role, payloadUserDto: PayloadUserDto): Promise<Role> {
    role.RoleID = uuid();
    role.CreatedBy = payloadUserDto.uid;
    role.CreatedAt = new Date();
    return this.roleRepository.save(role);
  }

  async update(
    roleId: string,
    role: Partial<Role>,
    payloadUserDto: PayloadUserDto,
  ): Promise<Role> {
    const updatedRole: Partial<Role> = {
      ...role,
      UpdatedBy: payloadUserDto.uid,
      UpdatedAt: new Date(),
    };
    await this.roleRepository.update(roleId, updatedRole);
    return await this.roleRepository.findOne({
      where: { RoleID: roleId },
    });
  }

  async delete(roleId: string, payloadUserDto: PayloadUserDto): Promise<void> {
    const role: Role = await this.roleRepository.findOne({
      where: { RoleID: roleId },
    });
    role.DeletedBy = payloadUserDto.uid;
    role.DeletedAt = new Date();
    await this.roleRepository.save(role);
  }
}
