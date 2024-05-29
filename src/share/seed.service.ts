import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from '../country/country.entity';
import { Company } from '../company/company.entity';
import { Role } from '../role/role.entity';
import { User } from '../user/user.entity';
import { SeedDto } from './seed.dto';
import { Plan } from 'src/subscription/plan.entity';
import { Feature } from 'src/subscription/feature.entity';
import { PlanFeature } from 'src/subscription/plan-feature.entity';

@Injectable()
export class SeedService {
  private seedsDto: SeedDto[] = [
    {
      name: 'Country',
      repository: this.countryRepository,
      jsonSeed: './src/share/seed/country.seed.json',
    },
    {
      name: 'User',
      repository: this.userRepository,
      jsonSeed: './src/share/seed/user.seed.json',
    },
    {
      name: 'Feature',
      repository: this.featureRepository,
      jsonSeed: './src/share/seed/feature.seed.json',
    },
    {
      name: 'Company',
      repository: this.companyRepository,
      jsonSeed: './src/share/seed/company.seed.json',
    },
    {
      name: 'Plan',
      repository: this.planRepository,
      jsonSeed: './src/share/seed/plan.seed.json',
    },
    {
      name: 'PlanFeature',
      repository: this.planFeatureRepository,
      jsonSeed: './src/share/seed/plan-feature.seed.json',
    },
    {
      name: 'Role',
      repository: this.roleRepository,
      jsonSeed: './src/share/seed/role.seed.json',
    },
  ];
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    @InjectRepository(Feature)
    private readonly featureRepository: Repository<Feature>,
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
    @InjectRepository(PlanFeature)
    private readonly planFeatureRepository: Repository<PlanFeature>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createSeed(): Promise<void> {
    for (const seed of this.seedsDto) {
      console.log('seed.name', seed.name);
      const data = JSON.parse(
        fs.readFileSync(path.resolve(seed.jsonSeed), 'utf-8'),
      );
      console.log(data);
      await seed.repository.save(data);
    }
  }

  async clearDatabase(): Promise<void> {
    for (const seed of this.seedsDto) {
      await seed.repository.clear();
    }
  }
}
