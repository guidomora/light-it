import { Test, TestingModule } from '@nestjs/testing';
import { PatientEntity } from '../entities/patient.entity';
import {
  PATIENT_REPOSITORY,
  PatientRepository,
} from '../interfaces/patient.repository.interface';
import { CreatePatientUseCase } from './create-patient.use-case';

describe('CreatePatientUseCase', () => {
  let createPatientUseCase: CreatePatientUseCase;
  let patientRepository: jest.Mocked<PatientRepository>;

  beforeEach(async () => {
    patientRepository = {
      createPatient: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatePatientUseCase,
        {
          provide: PATIENT_REPOSITORY,
          useValue: patientRepository,
        },
      ],
    }).compile();

    createPatientUseCase =
      module.get<CreatePatientUseCase>(CreatePatientUseCase);
  });

  it('creates a patient using the repository', async () => {
    const patientToCreate = {
      fullName: 'Ada Lovelace',
      emailAddress: 'ada@example.com',
      phoneNumber: '+541122233344',
      documentPhotoUrl: 'https://s3.aws.com/documents/ada.png',
    };

    const createdPatient = {
      id: 'uuid',
      ...patientToCreate,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as PatientEntity;

    patientRepository.createPatient.mockResolvedValue(createdPatient);

    const result = await createPatientUseCase.execute(patientToCreate);

    expect(patientRepository.createPatient.mock.calls[0][0]).toEqual(
      patientToCreate,
    );
    expect(result).toEqual(createdPatient);
  });
});
