import { Inject, Injectable } from '@nestjs/common';
import { PatientEntity } from '../../patients/entities/patient.entity';
import { SMS_QUEUE_PUBLISHER, SmsQueuePublisher } from '../interfaces';

@Injectable()
export class EnqueuePatientConfirmationSmsUseCase {
  constructor(
    @Inject(SMS_QUEUE_PUBLISHER)
    private readonly smsQueuePublisher: SmsQueuePublisher,
  ) {}

  async enqueuePatientConfirmationSms(
    patientEntity: PatientEntity,
  ): Promise<void> {
    await this.smsQueuePublisher.enqueuePatientConfirmationSmsJob({
      patientId: patientEntity.id,
      patientFullName: patientEntity.fullName,
      patientPhoneNumber: patientEntity.phoneNumber,
    });
  }
}
