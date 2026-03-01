import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from '../../notifications/services/notifications.service';
import {
  CreatePatientDetailsInput,
  DOCUMENT_PHOTO_STORAGE,
  DocumentPhotoStorage,
  PATIENT_REPOSITORY,
  PatientRepository,
  UploadedDocumentPhoto,
} from '../interfaces';
import {
  buildCreatePatientDetailsInput,
  buildPatientEntity,
  buildUploadedDocumentPhoto,
} from '../mocks';
import { CreatePatientUseCase } from './create-patient.use-case';

describe('GIVEN CreatePatientUseCase', () => {
  let createPatientUseCase: CreatePatientUseCase;
  let patientRepository: jest.Mocked<PatientRepository>;
  let documentPhotoStorage: jest.Mocked<DocumentPhotoStorage>;
  let notificationsServiceMock: {
    notifyPatientRegistration: jest.Mock;
  };

  beforeEach(async () => {
    patientRepository = {
      createPatient: jest.fn(),
    };

    documentPhotoStorage = {
      uploadDocumentPhoto: jest.fn(),
    };

    notificationsServiceMock = {
      notifyPatientRegistration: jest.fn(),
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
          provide: NotificationsService,
          useValue: notificationsServiceMock,
        },
      ],
    }).compile();

    createPatientUseCase =
      module.get<CreatePatientUseCase>(CreatePatientUseCase);
  });

  it('SHOULD upload document photo and create a patient using the repository', async () => {
    const patientRegistrationData: CreatePatientDetailsInput =
      buildCreatePatientDetailsInput();
    const uploadedDocumentPhoto: UploadedDocumentPhoto =
      buildUploadedDocumentPhoto({
        originalname: 'ada-document.png',
      });
    const documentPhotoUrl =
      'https://res.cloudinary.com/node161/image/upload/v000000/patients/documents/ada-document.png';
    const createdPatient = buildPatientEntity({
      id: 'uuid',
      ...patientRegistrationData,
      documentPhotoUrl,
    });

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

    expect(notificationsServiceMock.notifyPatientRegistration).toHaveBeenCalledWith(
      createdPatient,
    );

    expect(result).toEqual(createdPatient);
  });

  it('SHOULD return the created patient even when notifications fail', async () => {
    const patientRegistrationData: CreatePatientDetailsInput =
      buildCreatePatientDetailsInput({
        fullName: 'Grace Hopper',
        emailAddress: 'grace@example.com',
        phoneNumber: '+5491111122233',
      });
    const uploadedDocumentPhoto: UploadedDocumentPhoto =
      buildUploadedDocumentPhoto({
        buffer: Buffer.from('another-file-content'),
        mimetype: 'image/jpeg',
        originalname: 'grace-document.jpg',
        size: 18,
      });
    const createdPatient = buildPatientEntity({
      id: 'grace-uuid',
      ...patientRegistrationData,
      documentPhotoUrl: 'https://cdn.example.com/grace-document.jpg',
    });

    documentPhotoStorage.uploadDocumentPhoto.mockResolvedValue(
      createdPatient.documentPhotoUrl,
    );
    patientRepository.createPatient.mockResolvedValue(createdPatient);
    notificationsServiceMock.notifyPatientRegistration.mockRejectedValue(
      new Error('Notification unavailable'),
    );

    const result = await createPatientUseCase.createPatient(
      patientRegistrationData,
      uploadedDocumentPhoto,
    );

    expect(result).toEqual(createdPatient);
    expect(notificationsServiceMock.notifyPatientRegistration).toHaveBeenCalledWith(
      createdPatient,
    );
  });
});
