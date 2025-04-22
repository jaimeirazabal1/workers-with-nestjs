import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'workers_lab',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true, // No usar en producción
    }),
  ],
})
export class DatabaseModule {} 