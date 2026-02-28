import { Test, TestingModule } from '@nestjs/testing';
import {
  PATIENT_CONFIRMATION_NOTIFICATION_CHANNEL,
  PatientConfirmationNotificationChannel,
} from '../interfaces/patient-confirmation-notification-channel.interface';
import { SendPatientConfirmationNotificationUseCase } from './send-patient-confirmation-notification.use-case';

describe('SendPatientConfirmationNotificationUseCase', () => {
  let sendPatientConfirmationNotificationUseCase: SendPatientConfirmationNotificationUseCase;
  let patientConfirmationNotificationChannel: jest.Mocked<PatientConfirmationNotificationChannel>;

  beforeEach(async () => {
    patientConfirmationNotificationChannel = {
      sendPatientConfirmationNotification: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SendPatientConfirmationNotificationUseCase,
        {
          provide: PATIENT_CONFIRMATION_NOTIFICATION_CHANNEL,
          useValue: patientConfirmationNotificationChannel,
        },
      ],
    }).compile();

    sendPatientConfirmationNotificationUseCase =
      module.get<SendPatientConfirmationNotificationUseCase>(
        SendPatientConfirmationNotificationUseCase,
      );
  });

  it('delegates to notification channel with the job payload', async () => {
    const patientConfirmationNotification = {
      patientId: 'patient-1',
      patientFullName: 'Ada Lovelace',
      patientEmailAddress: 'ada@example.com',
    };

    await sendPatientConfirmationNotificationUseCase.sendPatientConfirmationNotification(
      patientConfirmationNotification,
    );

    expect(
      patientConfirmationNotificationChannel.sendPatientConfirmationNotification
        .mock.calls[0][0],
    ).toEqual(
      patientConfirmationNotification,
    );
  });
});
