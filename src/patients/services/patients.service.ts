import { Injectable } from '@nestjs/common';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { PatientEntity } from '../entities/patient.entity';
import { CreatePatientUseCase } from '../use-cases/create-patient.use-case';

@Injectable()
export class PatientsService {
  constructor(private readonly createPatientUseCase: CreatePatientUseCase) {}

  async createPatient(
    createPatientDto: CreatePatientDto,
  ): Promise<PatientEntity> {
    return this.createPatientUseCase.createPatient(createPatientDto);
  }
}
