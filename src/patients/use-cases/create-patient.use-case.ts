import { Inject, Injectable, Logger } from '@nestjs/common';
import { EnqueuePatientConfirmationEmailUseCase } from '../../notifications/use-cases/enqueue-patient-confirmation-email.use-case';
import { PatientEntity } from '../entities/patient.entity';
import { CreatePatientDetailsInput } from '../interfaces/create-patient-details.input';
import {
  DOCUMENT_PHOTO_STORAGE,
  DocumentPhotoStorage,
} from '../interfaces/document-photo-storage.interface';
import {
  PATIENT_REPOSITORY,
  PatientRepository,
} from '../interfaces/patient.repository.interface';
import { UploadedDocumentPhoto } from '../interfaces/uploaded-document-photo.interface';

@Injectable()
export class CreatePatientUseCase {
  private readonly logger = new Logger(CreatePatientUseCase.name);

  constructor(
    @Inject(PATIENT_REPOSITORY)
    private readonly patientRepository: PatientRepository,
    @Inject(DOCUMENT_PHOTO_STORAGE)
    private readonly documentPhotoStorage: DocumentPhotoStorage,
    private readonly enqueuePatientConfirmationEmailUseCase: EnqueuePatientConfirmationEmailUseCase,
  ) {}

  async createPatient(
    patientRegistrationData: CreatePatientDetailsInput,
    uploadedDocumentPhoto: UploadedDocumentPhoto,
  ): Promise<PatientEntity> {
    const documentPhotoUrl =
      await this.documentPhotoStorage.uploadDocumentPhoto(
        uploadedDocumentPhoto,
      );

    const createdPatient = await this.patientRepository.createPatient({
      ...patientRegistrationData,
      documentPhotoUrl,
    });

    try {
      await this.enqueuePatientConfirmationEmailUseCase.enqueuePatientConfirmationEmail(
        createdPatient,
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown queueing error.';

      this.logger.error(
        `Patient ${createdPatient.id} was created but email enqueue failed: ${errorMessage}`,
      );
    }

    return createdPatient;
  }
}
