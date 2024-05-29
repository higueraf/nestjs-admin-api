import { IsString, IsOptional } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  loginToken?: string;

  @IsString()
  @IsOptional()
  Token?: string;

  @IsString()
  @IsOptional()
  TwoStepToken?: string;

  @IsString()
  @IsOptional()
  companyId?: string;

  @IsString()
  @IsOptional()
  TokenSSOMicrosoft?: string;

  @IsString()
  @IsOptional()
  TokenSSOPingId?: string;
}
