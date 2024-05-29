import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Request,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { Role } from './role.entity';
import { RoleService } from './role.service';
import { ListResponseDto } from '../share/dto/list-response.dto';
import { Roles } from '../auth/roles.decorator';
import { RoleEnum } from '../share/enum/role-enum.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { LogService } from 'src/log/log.service';
import { LogCreateDto } from 'src/log/dto/log-create.dto';
import { PayloadUserDto } from 'src/auth/dto/payload-user.dto';
import { LogEvent } from 'src/log/log.entity';

@UseGuards(JwtAuthGuard)
@UseGuards(RolesGuard)
@Controller('role')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly logService: LogService,
  ) {}

  @Roles(RoleEnum.ROOT)
  @Get()
  async findAll(
    @Request() req,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query('search') search?: string,
  ): Promise<ListResponseDto> {
    const payloadUserDto: PayloadUserDto = req.user;
    const logCreateDto: LogCreateDto = new LogCreateDto();
    try {
      const response = await this.roleService.findAll(page, limit, search);
      logCreateDto.EventMessage = 'Get Roles';
      logCreateDto.EventMessage = payloadUserDto.companyid;
      await this.logService.create(logCreateDto, payloadUserDto);
      return response;
    } catch (Error) {
      logCreateDto.ErrorMessage = Error;
      logCreateDto.EventMethod = LogEvent.Error;
      await this.logService.create(logCreateDto, payloadUserDto);
    }
  }

  @Roles(RoleEnum.ROOT)
  @Get(':roleId')
  async findOne(
    @Request() req,
    @Param('roleId') roleId: string,
  ): Promise<Role> {
    const payloadUserDto: PayloadUserDto = req.user;
    const logCreateDto: LogCreateDto = new LogCreateDto();
    try {
      const response = this.roleService.findOne(roleId);
      logCreateDto.EventMessage = 'FindOne Role';
      logCreateDto.EventMethod = LogEvent.Read;
      logCreateDto.EventMessage = payloadUserDto.companyid;
      await this.logService.create(logCreateDto, payloadUserDto);
      return response;
    } catch (Error) {
      logCreateDto.ErrorMessage = Error;
      logCreateDto.EventMethod = LogEvent.Error;
      await this.logService.create(logCreateDto, payloadUserDto);
    }
  }

  @Roles(RoleEnum.ROOT)
  @Post()
  async create(@Request() req, @Body() role: Role): Promise<Role> {
    const payloadUserDto: PayloadUserDto = req.user;
    const logCreateDto: LogCreateDto = new LogCreateDto();
    try {
      const response = await this.roleService.create(role, payloadUserDto);
      logCreateDto.EventMessage = 'Create Role';
      logCreateDto.EventMethod = LogEvent.Create;
      logCreateDto.EventMessage = payloadUserDto.companyid;
      await this.logService.create(logCreateDto, payloadUserDto);
      return response;
    } catch (Error) {
      logCreateDto.ErrorMessage = Error;
      logCreateDto.EventMethod = LogEvent.Error;
      await this.logService.create(logCreateDto, payloadUserDto);
    }
  }

  @Roles(RoleEnum.ROOT)
  @Put(':roleId')
  async update(
    @Request() req,
    @Param('roleId') roleId: string,
    @Body() role: Role,
  ): Promise<Role> {
    const payloadUserDto: PayloadUserDto = req.user;
    const logCreateDto: LogCreateDto = new LogCreateDto();
    try {
      const response = await this.roleService.update(
        roleId,
        role,
        payloadUserDto,
      );
      logCreateDto.EventMessage = 'Update Role';
      logCreateDto.EventMessage = payloadUserDto.companyid;
      await this.logService.create(logCreateDto, payloadUserDto);
      return response;
    } catch (Error) {
      logCreateDto.ErrorMessage = Error;
      logCreateDto.EventMethod = LogEvent.Error;
      await this.logService.create(logCreateDto, payloadUserDto);
    }
  }

  @Roles(RoleEnum.ROOT)
  @Delete(':roleId')
  async delete(@Request() req, @Param('roleId') roleId: string): Promise<void> {
    const payloadUserDto: PayloadUserDto = req.user;
    const logCreateDto: LogCreateDto = new LogCreateDto();
    try {
      const response = await this.roleService.delete(roleId, payloadUserDto);
      logCreateDto.EventMessage = 'Get Roles';
      logCreateDto.EventMessage = payloadUserDto.companyid;
      await this.logService.create(logCreateDto, payloadUserDto);
      return response;
    } catch (Error) {
      logCreateDto.ErrorMessage = Error;
      logCreateDto.EventMethod = LogEvent.Error;
      await this.logService.create(logCreateDto, payloadUserDto);
    }
  }
}
