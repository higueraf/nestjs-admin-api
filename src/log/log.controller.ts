import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { Log } from './log.entity';
import { LogService } from './log.service';
import { ListResponseDto } from '../share/dto/list-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RoleEnum } from '../share/enum/role-enum.enum';

@UseGuards(JwtAuthGuard)
@UseGuards(RolesGuard)
@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Roles(RoleEnum.ROOT)
  @Get()
  async findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query('search') search?: string,
  ): Promise<ListResponseDto> {
    const result = await this.logService.findAll(page, limit, search);
    return result;
  }

  @Roles(RoleEnum.ROOT)
  @Get()
  @Get(':logId')
  async findOne(@Param('logId') logId: string): Promise<Log> {
    return this.logService.findOne(logId);
  }
}
