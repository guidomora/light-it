import { Injectable, Logger } from '@nestjs/common';
import { SmsMessageInput, SmsSender } from '../interfaces';

@Injectable()
export class SmsSenderAdapter implements SmsSender {
  private readonly logger = new Logger(SmsSenderAdapter.name);
  private readonly smsNotificationsEnabled = this.isSmsNotificationsEnabled();

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

  private isSmsNotificationsEnabled(): boolean {
    return process.env.NOTIFICATIONS_SMS_ENABLED?.toLowerCase() === 'true';
  }
}
