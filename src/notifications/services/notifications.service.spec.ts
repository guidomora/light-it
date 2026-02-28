import { Test, TestingModule } from '@nestjs/testing';
import { buildNotificationPatientEntity } from '../mocks';
import { EnqueuePatientConfirmationEmailUseCase } from '../use-cases/enqueue-patient-confirmation-email.use-case';
import { EnqueuePatientConfirmationSmsUseCase } from '../use-cases/enqueue-patient-confirmation-sms.use-case';
import { NotificationsService } from './notifications.service';

describe('NotificationsService', () => {
  let notificationsService: NotificationsService;
  let enqueuePatientConfirmationEmailUseCaseMock: {
    enqueuePatientConfirmationEmail: jest.Mock;
  };
  let enqueuePatientConfirmationSmsUseCaseMock: {
    enqueuePatientConfirmationSms: jest.Mock;
  };

  beforeEach(async () => {
    enqueuePatientConfirmationEmailUseCaseMock = {
      enqueuePatientConfirmationEmail: jest.fn(),
    };

    enqueuePatientConfirmationSmsUseCaseMock = {
      enqueuePatientConfirmationSms: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: EnqueuePatientConfirmationEmailUseCase,
          useValue: enqueuePatientConfirmationEmailUseCaseMock,
        },
        {
          provide: EnqueuePatientConfirmationSmsUseCase,
          useValue: enqueuePatientConfirmationSmsUseCaseMock,
        },
      ],
    }).compile();

    notificationsService = module.get<NotificationsService>(NotificationsService);
  });

  it('enqueues both email and sms notifications for a registered patient', async () => {
    const patientEntity = buildNotificationPatientEntity();

    await notificationsService.notifyPatientRegistration(patientEntity);

    expect(
      enqueuePatientConfirmationEmailUseCaseMock.enqueuePatientConfirmationEmail,
    ).toHaveBeenCalledWith(patientEntity);
    expect(
      enqueuePatientConfirmationSmsUseCaseMock.enqueuePatientConfirmationSms,
    ).toHaveBeenCalledWith(patientEntity);
  });

  it('does not throw when one notification channel enqueue fails', async () => {
    const patientEntity = buildNotificationPatientEntity();

    enqueuePatientConfirmationEmailUseCaseMock.enqueuePatientConfirmationEmail.mockRejectedValue(
      new Error('Queue unavailable'),
    );

    await expect(
      notificationsService.notifyPatientRegistration(patientEntity),
    ).resolves.toBeUndefined();

    expect(
      enqueuePatientConfirmationSmsUseCaseMock.enqueuePatientConfirmationSms,
    ).toHaveBeenCalledWith(patientEntity);
  });
});
