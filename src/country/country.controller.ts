import {
  Controller,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CountryService } from './country.service';
import { ListResponseDto } from '../share/dto/list-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query('search') search?: string,
  ): Promise<ListResponseDto> {
    const result = await this.countryService.findAll(page, limit, search);
    return result;
  }
}
