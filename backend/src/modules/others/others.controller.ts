import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFiles,
  Body,
  Put,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OthersService } from './others.service';

class CtaDto {
  @ApiProperty({ example: 'Have you noticed a persistent voice change?' })
  @IsString()
  @MaxLength(300)
  text!: string;

  @ApiProperty({ example: 'Book a Consultation' })
  @IsString()
  @MaxLength(60)
  buttonText!: string;

  @ApiProperty({ example: '/BookAppoinment' })
  @IsString()
  @MaxLength(500)
  link!: string;
}

const multerStorage = diskStorage({
  destination: (_req, _file, cb) => {
    const uploadPath = join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (_req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + extname(file.originalname));
  },
});

const uploadInterceptor = AnyFilesInterceptor({
  storage: multerStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

@ApiTags('Others')
@Controller('others')
export class OthersController {
  constructor(private readonly service: OthersService) {}

  @Get()
  getAll() {
    return this.service.getAll();
  }

  @Post('carousel/slide')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: Object })
  @UseInterceptors(uploadInterceptor)
  uploadCarouselSlide(@UploadedFiles() files: Express.Multer.File[]) {
    return this.service.addCarouselSlide(files);
  }

  @Put('carousel/slides/order')
  reorderCarouselSlides(@Body() body: { carousel?: unknown[] }) {
    return this.service.reorderCarousel(body?.carousel || []);
  }

  @Put('carousel/slide/:index/:variant')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(uploadInterceptor)
  replaceCarouselSlideVariant(
    @Param('index', ParseIntPipe) index: number,
    @Param('variant') variant: 'desktop' | 'tablet' | 'mobile',
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.service.replaceCarouselSlideVariant(index, variant, files);
  }

  @Delete('carousel/slide/:index')
  removeCarouselSlide(@Param('index', ParseIntPipe) index: number) {
    return this.service.removeCarouselSlide(index);
  }

  @Post('carousel')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: Object })
  @UseInterceptors(uploadInterceptor)
  uploadCarousel(@UploadedFiles() files: Express.Multer.File[]) {
    return this.service.addCarouselFiles(files);
  }

  @Delete('carousel/:name')
  removeCarousel(@Param('name') name: string) {
    return this.service.removeCarouselFile(name);
  }

  @Put('carousel/order')
  reorderCarousel(@Body() body: { carousel?: unknown[] }) {
    return this.service.reorderCarousel(body?.carousel || []);
  }

  @Put('carousel/:name')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(uploadInterceptor)
  replaceCarousel(@Param('name') name: string, @UploadedFiles() files: Express.Multer.File[]) {
    return this.service.replaceCarouselFile(name, files);
  }

  /* ── CTAs (site-wide, inserted into blogs from the editor) ── */

  @Post('ctas')
  addCta(@Body() body: CtaDto) {
    return this.service.addCta(body);
  }

  // Declared before 'ctas/:id' so "order" isn't treated as an id
  @Put('ctas/order')
  reorderCtas(@Body() body: { ids?: unknown[] }) {
    return this.service.reorderCtas(body?.ids || []);
  }

  @Put('ctas/:id')
  updateCta(@Param('id') id: string, @Body() body: CtaDto) {
    return this.service.updateCta(id, body);
  }

  @Delete('ctas/:id')
  removeCta(@Param('id') id: string) {
    return this.service.removeCta(id);
  }

  @Put('sheet-link')
  saveSheetLink(@Body() body: { sheetLink: string }) {
    return this.service.saveSheetLink(body.sheetLink || '');
  }
}
