import { LoginCompanyDto } from 'src/company/dto/login-company.dto';

export class LoginResponseDto {
  Token: string;
  CompanySetting?: string;
  Companies?: LoginCompanyDto[];
}
