import { CreatePatientInput } from './create-patient.input';
import { PatientEntity } from '../entities/patient.entity';

export const PATIENT_REPOSITORY = Symbol('PATIENT_REPOSITORY');

export interface PatientRepository {
  createPatient(patientToCreate: CreatePatientInput): Promise<PatientEntity>;
}
