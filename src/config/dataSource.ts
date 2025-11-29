import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';

ConfigModule.forRoot({
  envFilePath: `.env.${process.env.NODE_ENV || 'dev'}`,
});

const configService = new ConfigService();
// Environment loaded: process.env.NODE_ENV || 'dev'


export const dataSource: DataSourceOptions = {
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: +configService.get('DB_PORT'),
  username: configService.get('DB_USER'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*.{ts,js}'],
  synchronize: process.env.NODE_ENV === 'prod' ? false : true,
  // synchronize: true,
  dropSchema: process.env.NODE_ENV === 'test' ? true : false,
  logging: false,
};

export const AppDataSource = new DataSource(dataSource);