import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from '../branch/branch.entity';
import { Company } from '../company/company.entity';
import { Country } from '../country/country.entity';
import { Role } from '../role/role.entity';
import { User } from '../user/user.entity';
import { SeedDto } from '../share/seed.dto';
import { Log } from '../log/log.entity';

@Injectable()
export class RunTestService {
  private seedsDto: SeedDto[] = [
    {
      name: 'Branch',
      repository: this.branchRepository,
      jsonSeed: './src/run-test/seed/branch.seed.json',
    },
    {
      name: 'Country',
      repository: this.countryRepository,
      jsonSeed: './src/run-test/seed/country.seed.json',
    },
    {
      name: 'Log',
      repository: this.logRepository,
      jsonSeed: './src/run-test/seed/log.seed.json',
    },
    {
      name: 'Company',
      repository: this.companyRepository,
      jsonSeed: './src/run-test/seed/company.seed.json',
    },
    {
      name: 'Role',
      repository: this.roleRepository,
      jsonSeed: './src/run-test/seed/role.seed.json',
    },
    {
      name: 'User',
      repository: this.userRepository,
      jsonSeed: './src/run-test/seed/user.seed.json',
    },
  ];

  constructor(
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    @InjectRepository(Log)
    private readonly logRepository: Repository<Log>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createSeed(seeds: string[]): Promise<any> {
    for (const seed of this.seedsDto) {
      if (seeds.includes(seed.name)) {
        const data = JSON.parse(
          fs.readFileSync(path.resolve(seed.jsonSeed), 'utf-8'),
        );
        await seed.repository.save(data);
      }
    }
  }

  async clearDatabase(): Promise<any> {
    for (const seed of this.seedsDto) {
      await seed.repository.clear();
    }
  }
}
