import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CompanyService } from './company/company.service';
@Injectable()
export class AppService {
  constructor(
    @Inject(forwardRef(() => CompanyService))
    private readonly companyService: CompanyService,
  ) {}

  async testEnv(): Promise<any> {
    let testSQLServer;
    console.log('testEnv');
    try {
      const companies = await this.companyService.countCompanies();
      if (companies > 0) testSQLServer = 'OK';
    } catch (e) {
      console.log(e);
      throw new HttpException(
        'Error MsSql connection',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return {
      msg: 'Nestjs Admin Service',
      env: process.env.NODE_ENV,
      port: process.env.PORT,
      testSQLServer: testSQLServer,
    };
  }
}
