import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from './log.entity';
import { LogService } from './log.service';
import { LogController } from './log.controller';

@Module({
  controllers: [LogController],
  imports: [TypeOrmModule.forFeature([Log])],
  providers: [LogService],
})
export class LogModule {}
