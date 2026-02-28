import { PatientEntity } from '../entities/patient.entity';
import {
  CreatePatientDetailsInput,
  UploadedDocumentPhoto,
} from '../interfaces';

export function buildCreatePatientDetailsInput(
  overrides: Partial<CreatePatientDetailsInput> = {},
): CreatePatientDetailsInput {
  return {
    fullName: 'Ada Lovelace',
    emailAddress: 'ada@example.com',
    phoneNumber: '+541122233344',
    ...overrides,
  };
}

export function buildUploadedDocumentPhoto(
  overrides: Partial<UploadedDocumentPhoto> = {},
): UploadedDocumentPhoto {
  return {
    buffer: Buffer.from('file-content'),
    mimetype: 'image/png',
    originalname: 'patient-document.png',
    size: 12,
    ...overrides,
  };
}

export function buildPatientEntity(
  overrides: Partial<PatientEntity> = {},
): PatientEntity {
  const baseInput = buildCreatePatientDetailsInput();

  return {
    id: 'patient-1',
    fullName: baseInput.fullName,
    emailAddress: baseInput.emailAddress,
    phoneNumber: baseInput.phoneNumber,
    documentPhotoUrl:
      'https://res.cloudinary.com/node161/image/upload/v000000/patients/documents/patient-document.png',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  } as PatientEntity;
}
