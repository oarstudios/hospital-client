import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsArray,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateBlogDto {

  @ApiProperty()
  @IsString()
  title!: string;

  @ApiProperty()
  @IsString()
  slug!: string;

  @ApiProperty({ required: false, default: 'Blog' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  date?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  author?: string;

 
  
  @ApiProperty({ type: [Number], required: false })
@IsOptional()
@Transform(({ value }) => {

  // multiple tags
  if (Array.isArray(value)) {
    return value.map(Number).filter(Boolean);
  }

  // single tag
  if (value) {
    return [Number(value)];
  }

  return [];
})
@IsArray()
tags?: number[];

  /**
   * TipTap editor JSON sent as a JSON string from the frontend.
   * Stored as text in Postgres and parsed back on read.
   */
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  content?: string;

  // SEO
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  keywords?: string;

  // Cover image — handled by multer, declared for Swagger
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  image?: any;
}