import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseInterceptors,
  UploadedFiles,
  Query,
} from '@nestjs/common';

import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';

import {
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

import { CentersService } from './centers.service';
import { CreateCenterDto } from './dto/create-center.dto';
import { UpdateCenterDto } from './dto/update-center.dto';

@ApiTags('Centers')
@Controller('centers')
export class CentersController {
  constructor(private readonly service: CentersService) {}

  // 🔥 COMMON BOOLEAN PARSER
  private parseBoolean(value: any): boolean | undefined {
    if (value === undefined) return undefined;

    if (Array.isArray(value)) value = value[0];

    if (value === 'true' || value === '1') return true;
    if (value === 'false' || value === '0') return false;

    return undefined;
  }

  // ✅ CREATE
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateCenterDto })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'heroImage', maxCount: 1 },
        { name: 'centerImage', maxCount: 1 },
        { name: 'gallery', maxCount: 10 },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            const uploadPath = join(process.cwd(), 'uploads');

            if (!fs.existsSync(uploadPath)) {
              fs.mkdirSync(uploadPath, { recursive: true });
            }

            cb(null, uploadPath);
          },
          filename: (req, file, cb) => {
            const uniqueName =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, uniqueName + extname(file.originalname));
          },
        }),
      },
    ),
  )
  create(
    @UploadedFiles()
    files: {
      heroImage?: Express.Multer.File[];
      centerImage?: Express.Multer.File[];
      gallery?: Express.Multer.File[];
    },
    @Body() dto: CreateCenterDto,
  ) {
    return this.service.create(dto, files);
  }

  // ✅ FIND ALL
  @Get()
  @ApiQuery({
    name: 'isDeleted',
    required: false,
    type: Boolean,
  })
  findAll(@Query('isDeleted') isDeleted?: any) {
    const parsed = this.parseBoolean(isDeleted);
    return this.service.findAll(parsed);
  }

  // ✅ FIND ONE
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('isDeleted') isDeleted?: any,
  ) {
    const parsed = this.parseBoolean(isDeleted);
    return this.service.findOne(+id, parsed);
  }

  // ✅ UPDATE
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCenterDto) {
    return this.service.update(+id, dto);
  }

  // ✅ DELETE
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }

  // ✅ RESTORE
  @Put('restore/:id')
  restore(@Param('id') id: string) {
    return this.service.restore(+id);
  }
}