import { Inject, Injectable, Logger } from '@nestjs/common';
import { SMS_NOTIFICATIONS_ENABLED, SmsMessageInput, SmsSender } from '../interfaces';

@Injectable()
export class SmsSenderAdapter implements SmsSender {
  private readonly logger = new Logger(SmsSenderAdapter.name);

  constructor(
    @Inject(SMS_NOTIFICATIONS_ENABLED)
    private readonly smsNotificationsEnabled: boolean,
  ) {}

  async sendSms(smsMessage: SmsMessageInput): Promise<void> {
    if (this.smsNotificationsEnabled) {
      this.logger.warn(
        `SMS notifications are enabled but no provider is configured yet. Message for ${smsMessage.recipientPhoneNumber} was ignored.`,
      );
      return;
    }

    this.logger.debug(
      `SMS notifications are disabled. Message for ${smsMessage.recipientPhoneNumber} was ignored.`,
    );
  }
}
