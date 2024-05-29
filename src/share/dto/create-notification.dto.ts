import {
  IsNotEmpty,
  IsEmail,
  IsEnum,
  ValidateNested,
  IsArray,
  ArrayNotEmpty,
  IsString,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SendTypeEnum } from 'src/share/enum/send-type.enum';
import { NotificationTypeEnum } from '../enum/notification-type.enum';

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsString()
  CompanyUserID: string;

  @IsNotEmpty()
  @IsString()
  UserID: string;

  @IsOptional()
  @IsString()
  CompanyName: string;

  @IsNotEmpty()
  @IsEnum(NotificationTypeEnum)
  NotificationType: NotificationTypeEnum;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(SendTypeEnum, { each: true })
  SendType: SendTypeEnum[];

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => RecipientDto)
  Recipients: RecipientDto[];

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ParameterDto)
  Parameters: ParameterDto[];
}

export class ParameterDto {
  @IsNotEmpty()
  @IsString()
  Key: string;

  @IsNotEmpty()
  Value: any;
}

export class RecipientDto {
  @IsNotEmpty()
  @IsString()
  Name: string;

  @IsOptional()
  @IsEmail()
  Email?: string;

  @IsOptional()
  @IsString()
  CompanyUserID?: string;

  @IsOptional()
  @IsString()
  UserID?: string;
}
