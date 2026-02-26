import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePatientInput } from '../interfaces/create-patient.input';
import { PatientRepository } from '../interfaces/patient.repository.interface';
import { PatientEntity } from '../entities/patient.entity';

@Injectable()
export class TypeormPatientRepository implements PatientRepository {
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
