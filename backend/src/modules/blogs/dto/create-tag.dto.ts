import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateTagDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  tag!: string;
}