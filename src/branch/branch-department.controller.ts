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
import { BranchDepartment } from './branch-department.entity';
import { BranchDepartmentService } from './branch-department.service';
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
@Controller('branchDepartment')
export class BranchDepartmentController {
  constructor(
    private readonly branchDepartmentService: BranchDepartmentService,
    private readonly logService: LogService,
  ) {}

  @Roles(RoleEnum.ROOT)
  @Get()
  async findAll(
    @Request() req,
    @Param('branchId') branchId: string,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query('search') search?: string,
  ): Promise<ListResponseDto> {
    const payloadUserDto: PayloadUserDto = req.user;
    const logCreateDto: LogCreateDto = new LogCreateDto();
    try {
      const response = await this.branchDepartmentService.findByBranchId(
        branchId,
        page,
        limit,
        search,
      );
      logCreateDto.EventMessage = 'Get Branch Departments';
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
  @Get(':branchDepartmentId')
  async findOne(
    @Request() req,
    @Param('branchDepartmentId') branchDepartmentId: string,
  ): Promise<BranchDepartment> {
    const payloadUserDto: PayloadUserDto = req.user;
    const logCreateDto: LogCreateDto = new LogCreateDto();
    try {
      const response = this.branchDepartmentService.findOne(branchDepartmentId);
      logCreateDto.EventMessage = 'FindOne BranchDepartment';
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
  async create(
    @Request() req,
    @Body() branchDepartment: BranchDepartment,
  ): Promise<BranchDepartment> {
    const payloadUserDto: PayloadUserDto = req.user;
    const logCreateDto: LogCreateDto = new LogCreateDto();
    try {
      const response = await this.branchDepartmentService.create(
        branchDepartment,
        payloadUserDto,
      );
      logCreateDto.EventMessage = 'Create BranchDepartment';
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
  @Put(':branchDepartmentId')
  async update(
    @Request() req,
    @Param('branchDepartmentId') branchDepartmentId: string,
    @Body() branchDepartment: BranchDepartment,
  ): Promise<BranchDepartment> {
    const payloadUserDto: PayloadUserDto = req.user;
    const logCreateDto: LogCreateDto = new LogCreateDto();
    try {
      const response = await this.branchDepartmentService.update(
        branchDepartmentId,
        branchDepartment,
        payloadUserDto,
      );
      logCreateDto.EventMessage = 'Update BranchDepartment';
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
  @Delete(':branchDepartmentId')
  async delete(
    @Request() req,
    @Param('branchDepartmentId') branchDepartmentId: string,
  ): Promise<void> {
    const payloadUserDto: PayloadUserDto = req.user;
    const logCreateDto: LogCreateDto = new LogCreateDto();
    try {
      const response = await this.branchDepartmentService.delete(
        branchDepartmentId,
        payloadUserDto,
      );
      logCreateDto.EventMessage = 'Delete Branch Department';
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
