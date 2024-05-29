import { plainToClass } from 'class-transformer';
import * as crypto from 'crypto';
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { Inject } from '@nestjs/common/decorators';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { PayloadUserDto } from './dto/payload-user.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { PayloadCompanyDto } from './dto/payload-company.dto';
import { LoginCompanyDto } from '../company/dto/login-company.dto';
import { CompanyUser } from '../company/company-user.entity';
import { UserSettingService } from '../user/user-setting.service';
import { UserSetting } from '../user/user-setting.entity';
import { Subscription } from '../subscription/subscription.entity';
import { RoleEnum } from '../share/enum/role-enum.enum';
import { UserToken } from '../user/user-token.entity';
import { uuid } from 'uuidv4';
import { UserTokenService } from '../user/user-token.service';
import { CompanySetting } from '../company/company-setting.entity';
import { CreateNotificationDto } from '../share/dto/create-notification.dto';
import { NotificationService } from '../share/notification.service';
import { NotificationTypeEnum } from 'src/share/enum/notification-type.enum';
import { SendTypeEnum } from 'src/share/enum/send-type.enum';
import { TokenExpirationEnum } from './tokenexpiration.enum';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly userTokenService: UserTokenService,
    private readonly userSettingService: UserSettingService,
    private readonly jwtService: JwtService,
    private readonly notificationService: NotificationService,
  ) {}

  async decodeToken(token: string): Promise<any> {
    return this.jwtService.decode(token);
  }
  public async encodeToken(
    payload: PayloadUserDto | PayloadCompanyDto | number[],
    expiresIn: number = 3600,
  ): Promise<any> {
    return this.jwtService.sign(plainToClass(Object, payload), {
      expiresIn,
    });
  }

  private setPayloadUserDto(user: any): PayloadUserDto {
    const payloadUserDto: PayloadUserDto = new PayloadUserDto();
    payloadUserDto.name = user.Name;
    payloadUserDto.email = user.Email;
    payloadUserDto.title = user.Title ? user.Title : 'null';
    payloadUserDto.uid = user.UserID;
    return payloadUserDto;
  }

  private async handleSingleCompany(
    user: any,
    loginDto: LoginDto,
  ): Promise<LoginResponseDto> {
    const payloadUserDto = this.setPayloadUserDto(user);
    let companyUser: CompanyUser = user.companyUsers[0];
    let company = user.companyUsers[0].company;
    let userSetting = user.companyUsers[0].userSettings[0];
    if (loginDto.companyId) {
      companyUser = user.companyUsers.find(
        (companyUser) => companyUser.CompanyID === loginDto.companyId,
      );
      if (companyUser) {
        company = companyUser.company;
        userSetting = companyUser.userSettings[0];
      } else {
        throw new UnauthorizedException('Unauthorized');
      }
    }
    payloadUserDto.company = company.Name;
    payloadUserDto.companyid = company.CompanyID;
    payloadUserDto.companyuserid = companyUser.CompanyUserID;
    payloadUserDto.email = user.Email;
    payloadUserDto.role = userSetting.role.Name;
    const payloadCompanyDto: PayloadCompanyDto = new PayloadCompanyDto();
    payloadCompanyDto.name = company.Name;
    payloadCompanyDto.folderName = company.FolderName;
    payloadCompanyDto.companyId = company.Name;
    if (company.companySettings && company.companySettings[0]) {
      const companySetting = company.companySettings[0];
      payloadCompanyDto.whiteLogo = companySetting.WhiteLogo;
      payloadCompanyDto.darkLogo = companySetting.DarkLogo;
      payloadCompanyDto.loginBackground = companySetting.LoginBackground;
      payloadCompanyDto.useCompanyName = companySetting.UseCompanyName
        ? 'True'
        : 'False';
      payloadCompanyDto.shortcutLink = companySetting.ShortcoutLink;
    }
    const loginResponseDto: LoginResponseDto = new LoginResponseDto();
    loginResponseDto.Token = await this.encodeToken(
      payloadUserDto,
      TokenExpirationEnum.Day,
    );
    loginResponseDto.CompanySetting = await this.encodeToken(
      payloadCompanyDto,
      TokenExpirationEnum.Day,
    );
    return loginResponseDto;
  }

  private async handleMultipleCompanies(user: any): Promise<LoginResponseDto> {
    const loginCompanies: LoginCompanyDto[] = [];
    for (const companyUser of user.companyUsers) {
      const loginCompanyDto = new LoginCompanyDto();
      loginCompanyDto.CompanyID = companyUser.company.CompanyID;
      loginCompanyDto.CompanyName = companyUser.company.Name;
      loginCompanies.push(loginCompanyDto);
    }
    const payloadUserDto = this.setPayloadUserDto(user);
    const loginResponseDto: LoginResponseDto = new LoginResponseDto();
    loginResponseDto.Companies = loginCompanies;
    loginResponseDto.Token = await this.encodeToken(
      payloadUserDto,
      TokenExpirationEnum.Day,
    );
    return loginResponseDto;
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    let username: string;
    if (loginDto.loginToken) {
      const decodedToken = await this.decodeToken(loginDto.loginToken);
      username = decodedToken.email;
    } else if (loginDto.TokenSSOMicrosoft) {
      const decodedToken = await this.decodeToken(loginDto.TokenSSOMicrosoft);
      username = decodedToken.preferred_username;
    } else if (loginDto.TokenSSOPingId) {
      const decodedToken = await this.decodeToken(loginDto.TokenSSOPingId);
      username = decodedToken.email;
    } else {
      username = loginDto.username;
    }
    const user = await this.userService.findByEmail(username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (loginDto.password) {
      const isPasswordValid = bcrypt.compare(loginDto.password, user.Password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
    }
    if (user.companyUsers.length === 1 || loginDto.companyId) {
      return this.handleSingleCompany(user, loginDto);
    } else if (user.companyUsers.length > 1) {
      return this.handleMultipleCompanies(user);
    }
  }
  async handleSession(loginDto: LoginDto): Promise<Subscription> {
    try {
      const userSetting: UserSetting = await this.validateToken(loginDto.Token);
      if (!userSetting) {
        throw new UnauthorizedException('Unauthorized');
      }
      if (userSetting.companyUser.company.companySetting) {
        const authCheckResponse = await this.checkTwoStepAuth(
          loginDto,
          userSetting,
          false,
        );
        if (!authCheckResponse) {
          throw new UnauthorizedException('Unauthorized');
        }
      }
      return userSetting.companyUser.company.subscriptions.find(
        (subscription) => subscription.IsActive === true,
      );
    } catch (error) {
      throw new InternalServerErrorException('Error while validating token');
    }
  }

  async validateToken(token: string): Promise<UserSetting> {
    const userSetting: UserSetting | null = null;
    const payloadUserDto: PayloadUserDto = await this.decodeToken(token);
    if (!payloadUserDto) {
      throw new UnauthorizedException('Unauthorized');
    }
    try {
      const userSetting = await this.userSettingService.findByCompanyUserID(
        payloadUserDto.companyuserid,
      );
      if (!userSetting) {
        throw new UnauthorizedException('Unauthorized');
      }
      userSetting.DateLastActive = new Date();
      if (!userSetting.DateJoined) {
        userSetting.DateJoined = userSetting.CreatedAt;
      }
      await this.userSettingService.update(
        userSetting.UserSettingID,
        userSetting,
      );
    } catch (error) {
      throw new InternalServerErrorException('Error while validating token');
    }
    if (token !== (await this.decodeToken(userSetting.Token))) {
      throw new UnauthorizedException('Unauthorized');
    }
    return userSetting;
  }

  async checkTwoStepAuth(
    loginDto: LoginDto,
    userSetting: UserSetting,
    sendEmail: boolean = true,
  ): Promise<string> {
    const roleAdmin = userSetting.role.Name === RoleEnum.ADMIN;
    const roleViewer = userSetting.role.Name === RoleEnum.VIEWER;
    const roleGuest = userSetting.role.Name === RoleEnum.GUEST;
    const companySetting: CompanySetting =
      userSetting.companyUser.company.companySetting;
    if (
      companySetting &&
      (companySetting.IsTokenForAdmin ||
        companySetting.IsTokenForGuest ||
        companySetting.IsTokenForViewer)
    ) {
      let createToken = false;
      if (loginDto.TwoStepToken) {
        const userToken = await this.userTokenService.findOne({
          where: {
            UserSettingID: userSetting.UserSettingID,
            Token: loginDto.TwoStepToken,
          },
        });
        if (
          userToken &&
          userToken.ExpirationDate &&
          new Date() <= userToken.ExpirationDate
        ) {
          return '';
        }
      }
      if (roleAdmin && companySetting.IsTokenForAdmin) {
        createToken = true;
      }
      if (roleViewer && companySetting.IsTokenForViewer && !createToken) {
        createToken = true;
      }
      if (roleGuest && companySetting.IsTokenForGuest && !createToken) {
        createToken = true;
      }
      if (createToken) {
        if (sendEmail) {
          const randomBytes = crypto.randomBytes(length);
          const randomNumbers = Array.from(randomBytes).map(
            (byte) => byte % 1000,
          );
          const newUserToken = new UserToken();
          newUserToken.UserTokenID = uuid();
          newUserToken.ExpirationDate = new Date();
          newUserToken.ExpirationDate.setMinutes(
            newUserToken.ExpirationDate.getMinutes() + 10,
          );
          newUserToken.CreatedAt = new Date();
          newUserToken.IsUsed = false;
          newUserToken.CompanyUserID = userSetting.CompanyUserID;
          newUserToken.Token = await this.encodeToken(randomNumbers);
          await this.userTokenService.create(newUserToken);
          const createNotificationDto: CreateNotificationDto =
            new CreateNotificationDto();
          createNotificationDto.NotificationType =
            NotificationTypeEnum.TWO_STEP_TOKEN;
          createNotificationDto.SendType = [SendTypeEnum.EMAIL];
          createNotificationDto.Recipients = [
            {
              Email: userSetting.companyUser.user.Email,
              Name: userSetting.companyUser.user.Name,
            },
          ];
          createNotificationDto.Parameters = [
            { Key: 'RandomNumbers', Value: randomNumbers },
          ];
          await this.notificationService.send(createNotificationDto);
          return newUserToken.UserTokenID;
        } else {
          return 'MUST GENERATE NEW TOKEN';
        }
      }
    }
    return '';
  }
}
