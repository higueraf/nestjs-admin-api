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
import { Branch } from './branch.entity';
import { BranchService } from './branch.service';
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
@Controller('branch')
export class BranchController {
  constructor(
    private readonly branchService: BranchService,
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
      const response = await this.branchService.findAll(page, limit, search);
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
  @Get(':branchId')
  async findOne(
    @Request() req,
    @Param('branchId') branchId: string,
  ): Promise<Branch> {
    const payloadUserDto: PayloadUserDto = req.user;
    const logCreateDto: LogCreateDto = new LogCreateDto();
    try {
      const response = this.branchService.findOne(branchId);
      logCreateDto.EventMessage = 'FindOne Branch';
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
  async create(@Request() req, @Body() branch: Branch): Promise<Branch> {
    const payloadUserDto: PayloadUserDto = req.user;
    const logCreateDto: LogCreateDto = new LogCreateDto();
    try {
      const response = await this.branchService.create(branch, payloadUserDto);
      logCreateDto.EventMessage = 'Create Branch';
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
  @Put(':branchId')
  async update(
    @Request() req,
    @Param('branchId') branchId: string,
    @Body() branch: Branch,
  ): Promise<Branch> {
    const payloadUserDto: PayloadUserDto = req.user;
    const logCreateDto: LogCreateDto = new LogCreateDto();
    try {
      const response = await this.branchService.update(
        branchId,
        branch,
        payloadUserDto,
      );
      logCreateDto.EventMessage = 'Update Branch';
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
  @Delete(':branchId')
  async delete(
    @Request() req,
    @Param('branchId') branchId: string,
  ): Promise<void> {
    const payloadUserDto: PayloadUserDto = req.user;
    const logCreateDto: LogCreateDto = new LogCreateDto();
    try {
      const response = await this.branchService.delete(
        branchId,
        payloadUserDto,
      );
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
