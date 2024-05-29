import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserCreateCompanyDto {
  @IsNotEmpty()
  @IsString()
  Name: string;

  @IsNotEmpty()
  @IsEmail()
  Email: string;
}
