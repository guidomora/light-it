import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePatientDto } from './dto/create-patient.dto';
import { PatientEntity } from './entities/patient.entity';
import { UploadedDocumentPhoto } from './interfaces/uploaded-document-photo.interface';
import { PatientsService } from './services/patients.service';

@ApiTags('patients')
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('documentPhoto'))
  @ApiOperation({ summary: 'Create a patient and upload the document photo.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['fullName', 'emailAddress', 'phoneNumber', 'documentPhoto'],
      properties: {
        fullName: {
          type: 'string',
          minLength: 2,
          maxLength: 120,
          example: 'John Doe',
        },
        emailAddress: {
          type: 'string',
          format: 'email',
          minLength: 5,
          maxLength: 120,
          example: 'johndoe@example.com',
        },
        phoneNumber: {
          type: 'string',
          minLength: 6,
          maxLength: 40,
          example: '+541122233344',
        },
        documentPhoto: {
          type: 'string',
          format: 'binary',
          description: 'Patient document photo file.',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Patient created successfully.',
    type: PatientEntity,
  })
  @ApiBadRequestResponse({
    description: 'Validation error in body or invalid/missing file.',
  })
  async createPatient(
    @Body() createPatientDto: CreatePatientDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: /^image\/(jpeg|jpg|png|webp)$/ })
        .addMaxSizeValidator({ maxSize: 5 * 1024 * 1024 })
        .build({ fileIsRequired: true }),
    )
    uploadedDocumentPhoto: UploadedDocumentPhoto,
  ): Promise<PatientEntity> {
    return this.patientsService.createPatient(
      createPatientDto,
      uploadedDocumentPhoto,
    );
  }
}
