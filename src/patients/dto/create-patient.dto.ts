import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreatePatientDto {
  @ApiProperty({
    example: 'John Doe',
    minLength: 2,
    maxLength: 120,
    description: 'Patient full name.',
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 120)
  fullName: string;

  @ApiProperty({
    example: 'johndoe@example.com',
    minLength: 5,
    maxLength: 120,
    format: 'email',
    description: 'Patient email address.',
  })
  @IsEmail()
  @IsNotEmpty()
  @Length(5, 120)
  emailAddress: string;

  @ApiProperty({
    example: '+541122233344',
    minLength: 6,
    maxLength: 40,
    description: 'Patient phone number.',
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 40)
  phoneNumber: string;
}
