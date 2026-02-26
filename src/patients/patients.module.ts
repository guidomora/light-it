import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientEntity } from './entities/patient.entity';
import { PATIENT_REPOSITORY } from './interfaces/patient.repository.interface';
import { PatientsController } from './patients.controller';
import { TypeormPatientRepository } from './repositories/typeorm-patient.repository';
import { PatientsService } from './services/patients.service';
import { CreatePatientUseCase } from './use-cases/create-patient.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([PatientEntity])],
  controllers: [PatientsController],
  providers: [
    PatientsService,
    CreatePatientUseCase,
    TypeormPatientRepository,
    {
      provide: PATIENT_REPOSITORY,
      useExisting: TypeormPatientRepository,
    },
  ],
})
export class PatientsModule {}
