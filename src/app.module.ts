import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientsModule } from './patients/patients.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST ?? 'localhost',
      port: Number(process.env.POSTGRES_PORT ?? 5432),
      username: process.env.POSTGRES_USER ?? 'user',
      password: process.env.POSTGRES_PASSWORD ?? 'password123',
      database: process.env.POSTGRES_DB ?? 'myapp_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    PatientsModule,
  ],
})
export class AppModule {}
