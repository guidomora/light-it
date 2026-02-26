import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsModule } from '../notifications/notifications.module';
import { CloudinaryDocumentPhotoStorageAdapter } from './adapters/cloudinary-document-photo-storage.adapter';
import { PatientEntity } from './entities/patient.entity';
import { DOCUMENT_PHOTO_STORAGE } from './interfaces/document-photo-storage.interface';
import { PATIENT_REPOSITORY } from './interfaces/patient.repository.interface';
import { PatientsController } from './patients.controller';
import { TypeormPatientRepository } from './repositories/typeorm-patient.repository';
import { PatientsService } from './services/patients.service';
import { CreatePatientUseCase } from './use-cases/create-patient.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([PatientEntity]), NotificationsModule],
  controllers: [PatientsController],
  providers: [
    PatientsService,
    CreatePatientUseCase,
    TypeormPatientRepository,
    CloudinaryDocumentPhotoStorageAdapter,
    {
      provide: PATIENT_REPOSITORY,
      useExisting: TypeormPatientRepository,
    },
    {
      provide: DOCUMENT_PHOTO_STORAGE,
      useExisting: CloudinaryDocumentPhotoStorageAdapter,
    },
  ],
})
export class PatientsModule {}
