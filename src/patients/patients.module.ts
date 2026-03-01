import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsModule } from '../notifications/notifications.module';
import { CloudinaryDocumentPhotoStorageAdapter } from './adapters/cloudinary-document-photo-storage.adapter';
import { PatientEntity } from './entities/patient.entity';
import { DOCUMENT_PHOTO_STORAGE, PATIENT_REPOSITORY } from './interfaces';
import { PatientsController } from './patients.controller';
import { PatientRepositoryAdapter } from './repositories/patient.repository';
import { PatientsService } from './services/patients.service';
import { CreatePatientUseCase } from './use-cases/create-patient.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([PatientEntity]), NotificationsModule],
  controllers: [PatientsController],
  providers: [
    PatientsService,
    CreatePatientUseCase,
    PatientRepositoryAdapter,
    CloudinaryDocumentPhotoStorageAdapter,
    {
      provide: PATIENT_REPOSITORY,
      useExisting: PatientRepositoryAdapter,
    },
    {
      provide: DOCUMENT_PHOTO_STORAGE,
      useExisting: CloudinaryDocumentPhotoStorageAdapter,
    },
  ],
})
export class PatientsModule {}
