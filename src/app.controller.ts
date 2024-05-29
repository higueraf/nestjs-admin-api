import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('testEnv')
@Controller('testEnv')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  testEnv(): any {
    return this.appService.testEnv();
  }
}
