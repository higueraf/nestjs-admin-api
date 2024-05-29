import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  ParseIntPipe,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { ListResponseDto } from 'src/share/dto/list-response.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { AllRoles, RoleEnum } from 'src/share/enum/role-enum.enum';
import { PayloadUserDto } from 'src/auth/dto/payload-user.dto';
import { LogCreateDto } from 'src/log/dto/log-create.dto';
import { LogService } from 'src/log/log.service';
import { LogEvent } from 'src/log/log.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { SetPasswordDto } from './dto/set-password.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly logService: LogService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.MASTER, RoleEnum.ADMIN, RoleEnum.ROOT, RoleEnum.OWNER)
  @Get()
  async findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query('search') search?: string,
  ): Promise<ListResponseDto> {
    const result = await this.userService.findAll(page, limit, search);
    return result;
  }
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.MASTER, RoleEnum.ADMIN, RoleEnum.ROOT, RoleEnum.OWNER)
  @Get(':userId')
  async findOne(@Param('userId') userId: string): Promise<User> {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User Not found ${userId}`);
    }
    return user;
  }
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.MASTER, RoleEnum.ADMIN, RoleEnum.ROOT, RoleEnum.OWNER)
  @Post()
  async create(
    @Request() req,
    @Body() createUserDto: CreateUserDto,
  ): Promise<User> {
    const payloadUserDto: PayloadUserDto = req.user;
    const logCreateDto: LogCreateDto = new LogCreateDto();
    try {
      const response = await this.userService.create(
        createUserDto,
        payloadUserDto,
      );
      logCreateDto.EventMessage = 'Create User';
      logCreateDto.EventMethod = LogEvent.Create;
      await this.logService.create(logCreateDto, payloadUserDto);
      return response;
    } catch (Error) {
      console.log(Error);
      logCreateDto.ErrorMessage = Error;
      logCreateDto.EventMethod = LogEvent.Error;
      await this.logService.create(logCreateDto, payloadUserDto);
    }
  }
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.MASTER, RoleEnum.ADMIN, RoleEnum.ROOT, RoleEnum.OWNER)
  @Put(':userId')
  async update(
    @Request() req,
    @Param('userId') userId: string,
    @Body() user: Partial<User>,
  ): Promise<User> {
    const payloadUserDto: PayloadUserDto = req.user;
    const logCreateDto: LogCreateDto = new LogCreateDto();
    try {
      const updatedUser = await this.userService.update(
        userId,
        user,
        payloadUserDto,
      );
      if (!updatedUser) {
        throw new NotFoundException(`User Not found ${userId}`);
      }

      logCreateDto.EventMessage = 'Update Company';
      logCreateDto.EventMessage = payloadUserDto.companyid;
      await this.logService.create(logCreateDto, payloadUserDto);
      return updatedUser;
    } catch (Error) {
      logCreateDto.ErrorMessage = Error;
      logCreateDto.EventMethod = LogEvent.Error;
      await this.logService.create(logCreateDto, payloadUserDto);
    }
  }
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.MASTER, RoleEnum.ADMIN, RoleEnum.ROOT, RoleEnum.OWNER)
  @Get('by-email')
  async findByEmail(@Query('email') email: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  @Roles(RoleEnum.MASTER, RoleEnum.ADMIN, RoleEnum.ROOT, RoleEnum.OWNER)
  @Get('by-filter')
  async findByFilter(@Query() filter: any): Promise<User> {
    const user = await this.userService.findByFilter(filter);
    if (!user) {
      throw new NotFoundException(
        `User with filter ${JSON.stringify(filter)} not found`,
      );
    }
    return user;
  }

  @Roles(RoleEnum.MASTER, RoleEnum.ADMIN, RoleEnum.ROOT, RoleEnum.OWNER)
  @Delete(':userId')
  async delete(@Request() req, @Param('userId') userId: string): Promise<void> {
    const payloadUserDto: PayloadUserDto = req.user;
    const logCreateDto: LogCreateDto = new LogCreateDto();
    try {
      const user = await this.userService.delete(userId, payloadUserDto);
      logCreateDto.EventMessage = 'Modify User password by user';
      logCreateDto.EventMethod = LogEvent.Delete;
      await this.logService.create(logCreateDto, payloadUserDto);
      return user;
    } catch (Error) {
      console.log(Error);
      logCreateDto.ErrorMessage = Error;
      logCreateDto.EventMethod = LogEvent.Error;
      await this.logService.create(logCreateDto, payloadUserDto);
    }
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(AllRoles)
  @Put('password')
  async password(
    @Request() req,
    @Body() setPasswordDto: SetPasswordDto,
  ): Promise<any> {
    const payloadUserDto: PayloadUserDto = req.user;
    const logCreateDto: LogCreateDto = new LogCreateDto();
    try {
      const user = await this.userService.setPassword(
        setPasswordDto,
        payloadUserDto,
      );
      if (!user) {
        throw new NotFoundException(`User not found`);
      }
      logCreateDto.EventMessage = 'Modify User password by user';
      logCreateDto.EventMethod = LogEvent.Create;
      await this.logService.create(logCreateDto, payloadUserDto);
      return user;
    } catch (Error) {
      console.log(Error);
      logCreateDto.ErrorMessage = Error;
      logCreateDto.EventMethod = LogEvent.Error;
      await this.logService.create(logCreateDto, payloadUserDto);
    }
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(AllRoles)
  @Put('send/:id')
  async send(
    @Request() req,
    @Body() setPasswordDto: SetPasswordDto,
  ): Promise<any> {
    const payloadUserDto: PayloadUserDto = req.user;
    const logCreateDto: LogCreateDto = new LogCreateDto();
    try {
      const user = await this.userService.setPassword(
        setPasswordDto,
        payloadUserDto,
      );
      if (!user) {
        throw new NotFoundException(`User not found`);
      }
      logCreateDto.EventMessage = 'Modify User password by user';
      logCreateDto.EventMethod = LogEvent.Create;
      await this.logService.create(logCreateDto, payloadUserDto);
      return user;
    } catch (Error) {
      console.log(Error);
      logCreateDto.ErrorMessage = Error;
      logCreateDto.EventMethod = LogEvent.Error;
      await this.logService.create(logCreateDto, payloadUserDto);
    }
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(AllRoles)
  @Put('reset/:id')
  async reset(
    @Request() req,
    @Body() setPasswordDto: SetPasswordDto,
  ): Promise<any> {
    const payloadUserDto: PayloadUserDto = req.user;
    const logCreateDto: LogCreateDto = new LogCreateDto();
    try {
      const user = await this.userService.setPassword(
        setPasswordDto,
        payloadUserDto,
      );
      if (!user) {
        throw new NotFoundException(`User not found`);
      }
      logCreateDto.EventMessage = 'Modify User password by user';
      logCreateDto.EventMethod = LogEvent.Create;
      await this.logService.create(logCreateDto, payloadUserDto);
      return user;
    } catch (Error) {
      console.log(Error);
      logCreateDto.ErrorMessage = Error;
      logCreateDto.EventMethod = LogEvent.Error;
      await this.logService.create(logCreateDto, payloadUserDto);
    }
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(AllRoles)
  @Put('forgot/:email')
  async forgot(
    @Request() req,
    @Body() setPasswordDto: SetPasswordDto,
  ): Promise<any> {
    const payloadUserDto: PayloadUserDto = req.user;
    const logCreateDto: LogCreateDto = new LogCreateDto();
    try {
      const user = await this.userService.setPassword(
        setPasswordDto,
        payloadUserDto,
      );
      if (!user) {
        throw new NotFoundException(`User not found`);
      }
      logCreateDto.EventMessage = 'Modify User password by user';
      logCreateDto.EventMethod = LogEvent.Create;
      await this.logService.create(logCreateDto, payloadUserDto);
      return user;
    } catch (Error) {
      console.log(Error);
      logCreateDto.ErrorMessage = Error;
      logCreateDto.EventMethod = LogEvent.Error;
      await this.logService.create(logCreateDto, payloadUserDto);
    }
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(AllRoles)
  @Put('unlock/:id')
  async unlock(
    @Request() req,
    @Body() setPasswordDto: SetPasswordDto,
  ): Promise<any> {
    const payloadUserDto: PayloadUserDto = req.user;
    const logCreateDto: LogCreateDto = new LogCreateDto();
    try {
      const user = await this.userService.setPassword(
        setPasswordDto,
        payloadUserDto,
      );
      if (!user) {
        throw new NotFoundException(`User not found`);
      }
      logCreateDto.EventMessage = 'Modify User password by user';
      logCreateDto.EventMethod = LogEvent.Create;
      await this.logService.create(logCreateDto, payloadUserDto);
      return user;
    } catch (Error) {
      console.log(Error);
      logCreateDto.ErrorMessage = Error;
      logCreateDto.EventMethod = LogEvent.Error;
      await this.logService.create(logCreateDto, payloadUserDto);
    }
  }
}
