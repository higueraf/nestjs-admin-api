import {
  IsEmail,
  IsBoolean,
  IsUUID,
  IsArray,
  IsString,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly Name: string;

  @IsEmail()
  readonly Email: string;

  @IsBoolean()
  readonly IsLockedOut: boolean;

  @IsBoolean()
  readonly Status: boolean;

  @IsArray()
  readonly AssetList: any[];

  @IsOptional()
  @IsString()
  readonly Assets?: string;

  @IsUUID()
  readonly RoleID: string;

  @IsBoolean()
  readonly CanDownload: boolean;

  @IsUUID()
  readonly BranchDepartmentID: string;
}
