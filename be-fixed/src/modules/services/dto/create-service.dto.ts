import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class FaqItemDto {
  @ApiProperty({ example: 'Is this treatment painful?' })
  @IsString()
  question!: string;

  @ApiProperty({ example: 'No, it is generally painless.' })
  @IsString()
  answer!: string;
}

export class CreateServiceDto {
  @ApiProperty({ example: 'chemotherapy-treatment' })
  @IsString()
  slug!: string;

  @ApiProperty({ example: 'Chemotherapy Treatment' })
  @IsString()
  title!: string;

  @ApiPropertyOptional({ example: 'alt text for the cover image' })
  @IsOptional()
  @IsString()
  altText?: string;

  @ApiPropertyOptional({ example: 'Chemotherapy Treatment | ICTC' })
  @IsOptional()
  @IsString()
  seoTitle?: string;

  @ApiPropertyOptional({ example: 'Learn about chemotherapy at ICTC...' })
  @IsOptional()
  @IsString()
  metaDescription?: string;

  /**
   * Rich-text HTML content from the editor (sent as a plain string).
   */
  @ApiPropertyOptional({ example: '<p>Chemotherapy is...</p>' })
  @IsOptional()
  @IsString()
  content?: string;

  /**
   * Cover image — uploaded as multipart file.
   * Declared here for Swagger visibility only.
   */
  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  coverImage?: any;

  /**
   * FAQs — sent as a JSON string from multipart/form-data.
   * Example: '[{"question":"Q1","answer":"A1"}]'
   */
  @ApiPropertyOptional({
    type: 'string',
    example: '[{"question":"Is it painful?","answer":"No."}]',
    description: 'JSON string of FAQ array',
  })
  @IsOptional()
  faqs?: FaqItemDto[] | string;
}