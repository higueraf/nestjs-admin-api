import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { Log } from './log.entity';
import { ListResponseDto } from '../share/dto/list-response.dto';
import { LogCreateDto } from './dto/log-create.dto';
import { uuid } from 'uuidv4';
import { PayloadUserDto } from 'src/auth/dto/payload-user.dto';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(Log)
    private readonly logRepository: Repository<Log>,
  ) {}
  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<ListResponseDto> {
    const skip = (page - 1) * limit;
    const options: FindManyOptions<Log> = {
      skip,
      take: limit,
    };
    if (search) {
      options.where = {
        UserName: Like(`%${search}%`),
      };
    }
    const [data, totalCount] = await this.logRepository.findAndCount(options);
    const listResponseDto: ListResponseDto = {
      data,
      totalCount,
    };
    return listResponseDto;
  }

  findOne(logId: string): Promise<Log> {
    return this.logRepository.findOne({ where: { LogID: logId } });
  }

  async create(
    logCreateDto: LogCreateDto,
    payloadUserDto?: PayloadUserDto,
  ): Promise<void> {
    try {
      const log: Log = new Log();
      log.LogID = uuid();
      log.CompanyID = payloadUserDto.companyid
        ? payloadUserDto.companyid.toLowerCase()
        : null;
      log.CompanyName = payloadUserDto.company || null;
      log.ErrorMessage = 'logCreateDto.ErrorMessage';
      log.EventMessage = 'logCreateDto.EventMessage';
      log.EventMethod = logCreateDto.EventMethod;
      log.Microservice = 'nestjs-admin-api';
      log.UserID = payloadUserDto.uid || null;
      log.UserName = payloadUserDto.email || null;
      log.DateTime = new Date();
      await this.logRepository.save(log);
    } catch (error) {
      console.log('Error creating Log', error);
    }
  }
}
