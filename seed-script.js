import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeedService } from './seed/seed.service';

async function runSeed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seedService = app.get(SeedService);
  await seedService.createSeed();
  await app.close();
}

async function clearDatabase() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seedService = app.get(SeedService);
  await seedService.clearDatabase();
  await app.close();
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Por favor, proporciona un comando (run o clear)');
  process.exit(1);
}

const command = args[0];

if (command === 'run') {
  runSeed();
} else if (command === 'clear') {
  clearDatabase();
} else {
  console.error('Comando no válido. Usa "run" o "clear"');
  process.exit(1);
}
