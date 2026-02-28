import { PatientEntity } from '../../patients/entities/patient.entity';
import {
  PatientConfirmationEmailJobInput,
  PatientConfirmationSmsJobInput,
  SmsMessageInput,
} from '../interfaces';

export function buildNotificationPatientEntity(
  overrides: Partial<PatientEntity> = {},
): PatientEntity {
  return {
    id: 'patient-1',
    fullName: 'Ada Lovelace',
    emailAddress: 'ada@example.com',
    phoneNumber: '+15551234567',
    documentPhotoUrl: 'https://cdn.example.com/patient-document.png',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  } as PatientEntity;
}

export function buildPatientConfirmationEmailJobInput(
  overrides: Partial<PatientConfirmationEmailJobInput> = {},
): PatientConfirmationEmailJobInput {
  return {
    patientId: 'patient-1',
    patientFullName: 'Ada Lovelace',
    patientEmailAddress: 'ada@example.com',
    ...overrides,
  };
}

export function buildPatientConfirmationSmsJobInput(
  overrides: Partial<PatientConfirmationSmsJobInput> = {},
): PatientConfirmationSmsJobInput {
  return {
    patientId: 'patient-1',
    patientFullName: 'Ada Lovelace',
    patientPhoneNumber: '+15551234567',
    ...overrides,
  };
}

export function buildPatientConfirmationSmsMessage(
  overrides: Partial<SmsMessageInput> = {},
): SmsMessageInput {
  return {
    recipientPhoneNumber: '+15551234567',
    messageBody:
      'Hello Ada Lovelace, your registration has been completed successfully.',
    ...overrides,
  };
}
