import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientEntity } from '../entities/patient.entity';
import { CreatePatientInput, PatientRepository } from '../interfaces';

@Injectable()
export class PatientRepositoryAdapter implements PatientRepository {
  constructor(
    @InjectRepository(PatientEntity)
    private readonly patientOrmRepository: Repository<PatientEntity>,
  ) {}

  async createPatient(
    patientToCreate: CreatePatientInput,
  ): Promise<PatientEntity> {
    const patientEntity = this.patientOrmRepository.create(patientToCreate);
    return this.patientOrmRepository.save(patientEntity);
  }
}
