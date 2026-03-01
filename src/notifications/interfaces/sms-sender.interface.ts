import { SmsMessageInput } from './sms-message.input';

export const SMS_SENDER = Symbol('SMS_SENDER');

export interface SmsSender {
  sendSms(smsMessage: SmsMessageInput): Promise<void>;
}
