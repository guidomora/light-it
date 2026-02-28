import { SmsMessageInput } from './sms-message.input';

export const SMS_SENDER = Symbol('SMS_SENDER');
export const SMS_NOTIFICATIONS_ENABLED = Symbol('SMS_NOTIFICATIONS_ENABLED');

export interface SmsSender {
  sendSms(smsMessage: SmsMessageInput): Promise<void>;
}
