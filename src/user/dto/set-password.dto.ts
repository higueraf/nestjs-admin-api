import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SetPasswordDto {
  @IsNotEmpty()
  @IsString()
  Email: string;

  @IsNotEmpty()
  @IsEmail()
  Password: string;
}
