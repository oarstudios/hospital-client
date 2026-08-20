import { Controller, Get, Post, UseInterceptors, UploadedFiles, Body, Put, Delete, Param } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { OthersService } from './others.service';

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

@ApiTags('Others')
@Controller('others')
export class OthersController {
  constructor(private readonly service: OthersService) {}

  @Get()
  getAll() {
    return this.service.getAll();
  }

  @Post('carousel')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: Object })
  @UseInterceptors(AnyFilesInterceptor({ storage: multerStorage, limits: { fileSize: 10 * 1024 * 1024 } }))
  uploadCarousel(@UploadedFiles() files: Express.Multer.File[]) {
    return this.service.addCarouselFiles(files);
  }

  @Delete('carousel/:name')
  removeCarousel(@Param('name') name: string) {
    return this.service.removeCarouselFile(name);
  }

  @Put('carousel/order')
  reorderCarousel(@Body() body: { carousel?: string[] }) {
    return this.service.reorderCarousel(body?.carousel || []);
  }

  @Put('carousel/:name')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor({ storage: multerStorage, limits: { fileSize: 10 * 1024 * 1024 } }))
  replaceCarousel(@Param('name') name: string, @UploadedFiles() files: Express.Multer.File[]) {
    return this.service.replaceCarouselFile(name, files);
  }

  @Put('sheet-link')
  saveSheetLink(@Body() body: { sheetLink: string }) {
    return this.service.saveSheetLink(body.sheetLink || '');
  }
}
