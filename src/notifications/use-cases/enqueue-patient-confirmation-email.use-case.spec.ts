import { Test, TestingModule } from '@nestjs/testing';
import {
  EMAIL_QUEUE_PUBLISHER,
  EmailQueuePublisher,
} from '../interfaces';
import { buildNotificationPatientEntity } from '../mocks';
import { EnqueuePatientConfirmationEmailUseCase } from './enqueue-patient-confirmation-email.use-case';

describe('GIVEN EnqueuePatientConfirmationEmailUseCase', () => {
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

  it('SHOULD map patient data into queue payload and publish it', async () => {
    const patientEntity = buildNotificationPatientEntity();

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
