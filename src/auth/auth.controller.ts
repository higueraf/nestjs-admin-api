import { Body, Controller, Param, Post, Put, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { PayloadUserDto } from './dto/payload-user.dto';
import { LogCreateDto } from 'src/log/dto/log-create.dto';
import { LogEvent } from 'src/log/log.entity';
import { LogService } from 'src/log/log.service';
import { Subscription } from 'src/subscription/subscription.entity';
import { AllRoles } from '../share/enum/role-enum.enum';
import { Roles } from './roles.decorator';
import { UserSettingService } from 'src/user/user-setting.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logService: LogService,
    private readonly userSettingService: UserSettingService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    try {
      return this.authService.login(loginDto);
    } catch (Error) {
      const logCreateDto: LogCreateDto = new LogCreateDto();
      logCreateDto.EventMessage = 'Error Login ' + loginDto.username;
      logCreateDto.ErrorMessage = Error;
      logCreateDto.EventMethod = LogEvent.Error;
      await this.logService.create(logCreateDto);
    }
  }

  @Post('session')
  async session(
    @Request() req,
    @Body() loginDto: LoginDto,
  ): Promise<Subscription> {
    const payloadUserDto: PayloadUserDto = req.user;
    const logCreateDto: LogCreateDto = new LogCreateDto();
    try {
      return this.authService.handleSession(loginDto);
    } catch (Error) {
      logCreateDto.ErrorMessage = Error;
      logCreateDto.EventMethod = LogEvent.Error;
      await this.logService.create(logCreateDto, payloadUserDto);
    }
  }

  @Roles(AllRoles)
  @Put('logout/:companyUserId')
  async update(
    @Request() req,
    @Param('companyUserId') companyUserId: string,
  ): Promise<any> {
    const payloadUserDto: PayloadUserDto = req.user;
    const logCreateDto: LogCreateDto = new LogCreateDto();
    try {
      const response =
        await this.userSettingService.updateByCompanyUserID(companyUserId);
      logCreateDto.EventMessage = 'User logged out';
      await this.logService.create(logCreateDto, payloadUserDto);
      return response;
    } catch (Error) {
      logCreateDto.ErrorMessage = Error;
      logCreateDto.EventMethod = LogEvent.Error;
      await this.logService.create(logCreateDto, payloadUserDto);
    }
  }
}
