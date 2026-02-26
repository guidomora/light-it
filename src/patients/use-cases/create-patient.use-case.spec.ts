import { Test, TestingModule } from '@nestjs/testing';
import { EnqueuePatientConfirmationEmailUseCase } from '../../notifications/use-cases/enqueue-patient-confirmation-email.use-case';
import { PatientEntity } from '../entities/patient.entity';
import {
  DOCUMENT_PHOTO_STORAGE,
  DocumentPhotoStorage,
} from '../interfaces/document-photo-storage.interface';
import {
  PATIENT_REPOSITORY,
  PatientRepository,
} from '../interfaces/patient.repository.interface';
import { UploadedDocumentPhoto } from '../interfaces/uploaded-document-photo.interface';
import { CreatePatientUseCase } from './create-patient.use-case';

describe('CreatePatientUseCase', () => {
  let createPatientUseCase: CreatePatientUseCase;
  let patientRepository: jest.Mocked<PatientRepository>;
  let documentPhotoStorage: jest.Mocked<DocumentPhotoStorage>;
  let enqueuePatientConfirmationEmailUseCaseMock: {
    enqueuePatientConfirmationEmail: jest.Mock;
  };

  beforeEach(async () => {
    patientRepository = {
      createPatient: jest.fn(),
    };

    documentPhotoStorage = {
      uploadDocumentPhoto: jest.fn(),
    };

    enqueuePatientConfirmationEmailUseCaseMock = {
      enqueuePatientConfirmationEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatePatientUseCase,
        {
          provide: PATIENT_REPOSITORY,
          useValue: patientRepository,
        },
        {
          provide: DOCUMENT_PHOTO_STORAGE,
          useValue: documentPhotoStorage,
        },
        {
          provide: EnqueuePatientConfirmationEmailUseCase,
          useValue: enqueuePatientConfirmationEmailUseCaseMock,
        },
      ],
    }).compile();

    createPatientUseCase =
      module.get<CreatePatientUseCase>(CreatePatientUseCase);
  });

  it('uploads document photo and creates a patient using the repository', async () => {
    const patientRegistrationData = {
      fullName: 'Ada Lovelace',
      emailAddress: 'ada@example.com',
      phoneNumber: '+541122233344',
    };

    const uploadedDocumentPhoto: UploadedDocumentPhoto = {
      buffer: Buffer.from('file-content'),
      mimetype: 'image/png',
      originalname: 'ada-document.png',
      size: 12,
    };

    const documentPhotoUrl =
      'https://res.cloudinary.com/node161/image/upload/v000000/patients/documents/ada-document.png';

    const createdPatient = {
      id: 'uuid',
      ...patientRegistrationData,
      documentPhotoUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as PatientEntity;

    documentPhotoStorage.uploadDocumentPhoto.mockResolvedValue(
      documentPhotoUrl,
    );
    patientRepository.createPatient.mockResolvedValue(createdPatient);

    const result = await createPatientUseCase.createPatient(
      patientRegistrationData,
      uploadedDocumentPhoto,
    );

    expect(documentPhotoStorage.uploadDocumentPhoto.mock.calls[0][0]).toEqual(
      uploadedDocumentPhoto,
    );

    expect(patientRepository.createPatient.mock.calls[0][0]).toEqual({
      ...patientRegistrationData,
      documentPhotoUrl,
    });

    expect(
      enqueuePatientConfirmationEmailUseCaseMock.enqueuePatientConfirmationEmail,
    ).toHaveBeenCalledWith(createdPatient);

    expect(result).toEqual(createdPatient);
  });

  it('returns the created patient even when email queueing fails', async () => {
    const patientRegistrationData = {
      fullName: 'Grace Hopper',
      emailAddress: 'grace@example.com',
      phoneNumber: '+5491111122233',
    };

    const uploadedDocumentPhoto: UploadedDocumentPhoto = {
      buffer: Buffer.from('another-file-content'),
      mimetype: 'image/jpeg',
      originalname: 'grace-document.jpg',
      size: 18,
    };

    const createdPatient = {
      id: 'grace-uuid',
      ...patientRegistrationData,
      documentPhotoUrl: 'https://cdn.example.com/grace-document.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as PatientEntity;

    documentPhotoStorage.uploadDocumentPhoto.mockResolvedValue(
      createdPatient.documentPhotoUrl,
    );
    patientRepository.createPatient.mockResolvedValue(createdPatient);
    enqueuePatientConfirmationEmailUseCaseMock.enqueuePatientConfirmationEmail.mockRejectedValue(
      new Error('Queue unavailable'),
    );

    const result = await createPatientUseCase.createPatient(
      patientRegistrationData,
      uploadedDocumentPhoto,
    );

    expect(result).toEqual(createdPatient);
  });
});
