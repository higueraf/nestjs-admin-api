import { join } from 'path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { SqlServerConnectionOptions } from 'typeorm/driver/sqlserver/SqlServerConnectionOptions';

let config: TypeOrmModuleOptions &
  (PostgresConnectionOptions | SqlServerConnectionOptions);

if (!process.env.NODE_ENV) {
  console.log('Using Postgres');
  config = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT, 10),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    entities: [join(__dirname, '**', '*.entity.{ts,js}')],
    synchronize: false,
    migrationsRun: false,
    migrations: ['dist/migrations/*.js'],
  };
} else {
  console.log('Using MSSQL');
  console.log(process.env.MSSQL_HOST);
  console.log(process.env.NODE_ENV);
  config = {
    type: 'mssql',
    host: process.env.MSSQL_HOST,
    port: parseInt(process.env.MSSQL_PORT, 10),
    username: process.env.MSSQL_USER,
    password: process.env.MSSQL_PASSWORD,
    database: process.env.MSSQL_DATABASE,
    entities: ['dist/**/*.entity.js'],
    synchronize: false,
    migrationsRun: false,
    migrations: ['dist/migrations/*.js'],
  };
}

export const datasource = new DataSource(config);
export { config };
