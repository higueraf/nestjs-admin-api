import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UserCreateCompanyDto } from '../../user/dto/user-create-company.dto';

export class CreateCompanyDto {
  @IsNotEmpty()
  @IsString()
  CompanyName: string;

  @IsNotEmpty()
  @IsInt()
  SeatsQty: number;

  @IsNotEmpty()
  @IsInt()
  Storage: number;

  @IsNotEmpty()
  @IsDateString()
  StartDate: Date;

  @IsNotEmpty()
  @IsDateString()
  EndDate: Date;

  @IsNotEmpty()
  @IsString()
  ResellerID: string;

  @IsNotEmpty()
  @IsBoolean()
  IsUnlimitedViewers: boolean;

  @IsNotEmpty()
  @IsBoolean()
  IsWhiteLabel: boolean;

  @IsNotEmpty()
  @ValidateNested()
  User: UserCreateCompanyDto;

  @IsNotEmpty()
  @ValidateNested()
  Owner: UserCreateCompanyDto;

  @IsNotEmpty()
  @IsString()
  ServerID: string;

  @IsNotEmpty()
  @IsString()
  PlanID: string;

  @IsNotEmpty()
  @IsString()
  FrequencyPayment: string;

  @IsNotEmpty()
  @IsBoolean()
  IsUnlimitedGuests: boolean;

  @IsNotEmpty()
  @IsString()
  GuestsQTY: string;

  @IsNotEmpty()
  @IsString()
  PhoneNumber: string;
  Address: string;
  CountryID: string;
}
