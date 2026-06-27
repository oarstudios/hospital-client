import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAppointmentDto {

  @ApiProperty()
  @IsString()
  patientName!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  age?: number;

  @ApiProperty()
  @IsString()
  phone!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  area?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  center?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  centerId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  appointmentDate?: string;

  @ApiProperty({ required: false, default: 'Website_Form' })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiProperty({ required: false, enum: ['Pending', 'Confirmed', 'Cancelled'] })
  @IsOptional()
  @IsIn(['Pending', 'Confirmed', 'Cancelled'])
  status?: string;
}