import { Test, TestingModule } from '@nestjs/testing';
import {
  EMAIL_SENDER,
  EmailSender,
} from '../interfaces/email-sender.interface';
import { SendPatientConfirmationEmailUseCase } from './send-patient-confirmation-email.use-case';

describe('SendPatientConfirmationEmailUseCase', () => {
  let sendPatientConfirmationEmailUseCase: SendPatientConfirmationEmailUseCase;
  let emailSender: jest.Mocked<EmailSender>;

  beforeEach(async () => {
    emailSender = {
      sendPatientConfirmationEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SendPatientConfirmationEmailUseCase,
        {
          provide: EMAIL_SENDER,
          useValue: emailSender,
        },
      ],
    }).compile();

    sendPatientConfirmationEmailUseCase =
      module.get<SendPatientConfirmationEmailUseCase>(
        SendPatientConfirmationEmailUseCase,
      );
  });

  it('delegates to email sender with the job payload', async () => {
    const patientConfirmationEmailJob = {
      patientId: 'patient-1',
      patientFullName: 'Ada Lovelace',
      patientEmailAddress: 'ada@example.com',
    };

    await sendPatientConfirmationEmailUseCase.sendPatientConfirmationEmail(
      patientConfirmationEmailJob,
    );

    expect(emailSender.sendPatientConfirmationEmail.mock.calls[0][0]).toEqual(
      patientConfirmationEmailJob,
    );
  });
});
