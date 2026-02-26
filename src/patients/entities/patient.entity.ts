import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'patients' })
export class PatientEntity {
  @ApiProperty({
    example: '0e5ea3f6-95eb-4c4c-8f8e-4ff3f2509f8b',
    description: 'Unique patient identifier.',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Ada Lovelace',
    description: 'Patient full name.',
  })
  @Column({ type: 'varchar', length: 120 })
  fullName: string;

  @ApiProperty({
    example: 'ada.lovelace@example.com',
    description: 'Patient email address.',
  })
  @Column({ type: 'varchar', length: 120, unique: true })
  emailAddress: string;

  @ApiProperty({
    example: '+15551234567',
    description: 'Patient phone number.',
  })
  @Column({ type: 'varchar', length: 40 })
  phoneNumber: string;

  @ApiProperty({
    example:
      'https://res.cloudinary.com/node161/image/upload/v000000/patients/documents/document.jpg',
    description: 'Cloudinary URL of the patient document photo.',
  })
  @Column({ type: 'varchar', length: 500 })
  documentPhotoUrl: string;

  @ApiProperty({
    example: '2026-02-26T20:15:30.000Z',
    description: 'Creation timestamp in ISO-8601 format.',
  })
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty({
    example: '2026-02-26T20:15:30.000Z',
    description: 'Last update timestamp in ISO-8601 format.',
  })
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
