import { Test, TestingModule } from '@nestjs/testing';
import { CountryService } from './country.service';
import { RunTestModule } from '../run-test/run-test.module';
import { RunTestService } from '../run-test/run-test.service';

describe('CountryService', () => {
  let countryService: CountryService;
  let runTestService: RunTestService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...RunTestModule()],
      providers: [CountryService, RunTestService],
    }).compile();
    countryService = module.get<CountryService>(CountryService);
    runTestService = module.get<RunTestService>(RunTestService);
    await runTestService.createSeed(['Country']);
  });

  it('findAll', async () => {
    const countries = await countryService.findAll();
    expect(countries.data).toHaveLength(10);
  });

  it('findAll with search', async () => {
    const searchTerm = 'Albania';
    const countries = await countryService.findAll(1, 10, searchTerm);
    expect(countries.data).toHaveLength(1);
    countries.data.forEach((country) => {
      expect(country.Name.toLowerCase()).toContain(searchTerm.toLowerCase());
    });
  });

  afterAll(async () => {
    await runTestService.clearDatabase();
  });
});
