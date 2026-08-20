import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNumber,
} from 'class-validator';

export class EducationItemDto {
  @ApiProperty()
  @IsString()
  title!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  place?: string;
}

export class ExperienceItemDto {
  @ApiProperty()
  @IsString()
  role!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  place?: string;
}

// ✅ One assigned centre + an optional doctor-specific map link for that centre.
// When mapLink is omitted, the frontend falls back to the centre's own mapLink.
export class CentreAssignmentDto {
  @ApiProperty()
  @IsNumber()
  centreId!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mapLink?: string;
}

export class CreateDoctorDto {
  @ApiProperty()
  @IsString()
  slug!: string;

  @ApiProperty()
  @IsString()
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  designation?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  qualification?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  rating?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reviews?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  philosophy?: string;

  // ✅ Doctor photo uploaded separately via multipart
  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  image?: any;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  altText?: string;

  // ✅ Assigned centres — sent as a JSON string from form-data.
  // Accepts either the legacy shape (number[] of centre IDs) or the new
  // shape (CentreAssignmentDto[] with an optional per-centre mapLink).
  @ApiPropertyOptional({
    type: [CentreAssignmentDto],
    description:
      'Assigned centres. Either [1,2] (legacy) or [{"centreId":1,"mapLink":"https://..."}]',
  })
  @IsOptional()
  centreIds?: CentreAssignmentDto[] | number[] | string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  stories?: string[] | string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  languages?: string[] | string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  expertise?: string[] | string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  achievements?: string[] | string;

  // ✅ Arrays of objects — sent as JSON string
  @ApiPropertyOptional({ type: [EducationItemDto] })
  @IsOptional()
  education?: EducationItemDto[] | string;

  @ApiPropertyOptional({ type: [ExperienceItemDto] })
  @IsOptional()
  experience?: ExperienceItemDto[] | string;
}