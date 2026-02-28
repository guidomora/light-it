import { Inject, Injectable } from '@nestjs/common';
import {
  PatientConfirmationSmsJobInput,
  SMS_SENDER,
  SmsMessageInput,
  SmsSender,
} from '../interfaces';

@Injectable()
export class SendPatientConfirmationSmsUseCase {
  constructor(
    @Inject(SMS_SENDER)
    private readonly smsSender: SmsSender,
  ) {}

  async sendPatientConfirmationSms(
    patientConfirmationSmsJob: PatientConfirmationSmsJobInput,
  ): Promise<void> {
    const smsMessage: SmsMessageInput = {
      recipientPhoneNumber: patientConfirmationSmsJob.patientPhoneNumber,
      messageBody: `Hello ${patientConfirmationSmsJob.patientFullName}, your registration has been completed successfully.`,
    };

    await this.smsSender.sendSms(smsMessage);
  }
}
