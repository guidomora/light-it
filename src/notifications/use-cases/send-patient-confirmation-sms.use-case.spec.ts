import { Test, TestingModule } from '@nestjs/testing';
import { SMS_SENDER, SmsSender } from '../interfaces';
import {
  buildPatientConfirmationSmsJobInput,
  buildPatientConfirmationSmsMessage,
} from '../mocks';
import { SendPatientConfirmationSmsUseCase } from './send-patient-confirmation-sms.use-case';

describe('SendPatientConfirmationSmsUseCase', () => {
  let sendPatientConfirmationSmsUseCase: SendPatientConfirmationSmsUseCase;
  let smsSender: jest.Mocked<SmsSender>;

  beforeEach(async () => {
    smsSender = {
      sendSms: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SendPatientConfirmationSmsUseCase,
        {
          provide: SMS_SENDER,
          useValue: smsSender,
        },
      ],
    }).compile();

    sendPatientConfirmationSmsUseCase =
      module.get<SendPatientConfirmationSmsUseCase>(
        SendPatientConfirmationSmsUseCase,
      );
  });

  it('maps sms job data into an sms message and delegates to sms sender', async () => {
    const patientConfirmationSmsJob = buildPatientConfirmationSmsJobInput();

    await sendPatientConfirmationSmsUseCase.sendPatientConfirmationSms(
      patientConfirmationSmsJob,
    );

    expect(smsSender.sendSms.mock.calls[0][0]).toEqual(
      buildPatientConfirmationSmsMessage(),
    );
  });
});
