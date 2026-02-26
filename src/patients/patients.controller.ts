import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePatientDto } from './dto/create-patient.dto';
import { PatientEntity } from './entities/patient.entity';
import { PatientsService } from './services/patients.service';

@ApiTags('patients')
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a patient (happy path).' })
  @ApiCreatedResponse({
    description: 'Patient created successfully.',
    type: PatientEntity,
  })
  @ApiBadRequestResponse({ description: 'Validation error in request body.' })
  async createPatient(
    @Body() createPatientDto: CreatePatientDto,
  ): Promise<PatientEntity> {
    return this.patientsService.createPatient(createPatientDto);
  }
}
