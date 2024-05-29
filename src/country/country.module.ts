import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from './country.entity';
import { CountryService } from './country.service';
import { CountryController } from './country.controller';

@Module({
  controllers: [CountryController],
  imports: [TypeOrmModule.forFeature([Country])],
  providers: [CountryService],
})
export class CountryModule {}
