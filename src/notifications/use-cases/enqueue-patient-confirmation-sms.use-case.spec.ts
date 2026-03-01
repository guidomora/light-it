import { Test, TestingModule } from '@nestjs/testing';
import {
  SMS_QUEUE_PUBLISHER,
  SmsQueuePublisher,
} from '../interfaces';
import { buildNotificationPatientEntity } from '../mocks';
import { EnqueuePatientConfirmationSmsUseCase } from './enqueue-patient-confirmation-sms.use-case';

describe('GIVEN EnqueuePatientConfirmationSmsUseCase', () => {
  let enqueuePatientConfirmationSmsUseCase: EnqueuePatientConfirmationSmsUseCase;
  let smsQueuePublisher: jest.Mocked<SmsQueuePublisher>;

  beforeEach(async () => {
    smsQueuePublisher = {
      enqueuePatientConfirmationSmsJob: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnqueuePatientConfirmationSmsUseCase,
        {
          provide: SMS_QUEUE_PUBLISHER,
          useValue: smsQueuePublisher,
        },
      ],
    }).compile();

    enqueuePatientConfirmationSmsUseCase =
      module.get<EnqueuePatientConfirmationSmsUseCase>(
        EnqueuePatientConfirmationSmsUseCase,
      );
  });

  it('SHOULD map patient data into sms queue payload and publish it', async () => {
    const patientEntity = buildNotificationPatientEntity();

    await enqueuePatientConfirmationSmsUseCase.enqueuePatientConfirmationSms(
      patientEntity,
    );

    expect(
      smsQueuePublisher.enqueuePatientConfirmationSmsJob.mock.calls[0][0],
    ).toEqual({
      patientId: patientEntity.id,
      patientFullName: patientEntity.fullName,
      patientPhoneNumber: patientEntity.phoneNumber,
    });
  });
});
