import { Test, TestingModule } from '@nestjs/testing';
import { PatientEntity } from '../../patients/entities/patient.entity';
import {
  EMAIL_QUEUE_PUBLISHER,
  EmailQueuePublisher,
} from '../interfaces/email-queue-publisher.interface';
import { EnqueuePatientConfirmationEmailUseCase } from './enqueue-patient-confirmation-email.use-case';

describe('EnqueuePatientConfirmationEmailUseCase', () => {
  let enqueuePatientConfirmationEmailUseCase: EnqueuePatientConfirmationEmailUseCase;
  let emailQueuePublisher: jest.Mocked<EmailQueuePublisher>;

  beforeEach(async () => {
    emailQueuePublisher = {
      enqueuePatientConfirmationEmailJob: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnqueuePatientConfirmationEmailUseCase,
        {
          provide: EMAIL_QUEUE_PUBLISHER,
          useValue: emailQueuePublisher,
        },
      ],
    }).compile();

    enqueuePatientConfirmationEmailUseCase =
      module.get<EnqueuePatientConfirmationEmailUseCase>(
        EnqueuePatientConfirmationEmailUseCase,
      );
  });

  it('maps patient data into queue payload and publishes it', async () => {
    const patientEntity = {
      id: 'patient-1',
      fullName: 'Ada Lovelace',
      emailAddress: 'ada@example.com',
    } as PatientEntity;

    await enqueuePatientConfirmationEmailUseCase.enqueuePatientConfirmationEmail(
      patientEntity,
    );

    expect(
      emailQueuePublisher.enqueuePatientConfirmationEmailJob.mock.calls[0][0],
    ).toEqual({
      patientId: patientEntity.id,
      patientFullName: patientEntity.fullName,
      patientEmailAddress: patientEntity.emailAddress,
    });
  });
});
