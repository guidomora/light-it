import { Inject, Injectable } from '@nestjs/common';
import { CreatePatientInput } from '../interfaces/create-patient.input';
import {
  PATIENT_REPOSITORY,
  PatientRepository,
} from '../interfaces/patient.repository.interface';
import { PatientEntity } from '../entities/patient.entity';

@Injectable()
export class CreatePatientUseCase {
  constructor(
    @Inject(PATIENT_REPOSITORY)
    private readonly patientRepository: PatientRepository,
  ) {}

  async createPatient(
    patientRegistrationData: CreatePatientInput,
  ): Promise<PatientEntity> {
    return this.patientRepository.createPatient(patientRegistrationData);
  }
}
