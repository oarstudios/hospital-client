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
import { extname } from 'path';

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
          destination: './uploads',
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

  // ✅ FIND ALL (with optional isDeleted)
  @Get()
  @ApiQuery({
    name: 'isDeleted',
    required: false,
    type: Boolean,
    description: 'true = deleted, false = active',
  })
  findAll(@Query('isDeleted') isDeleted?: string) {
    const parsed =
      isDeleted !== undefined ? isDeleted === 'true' : undefined;

    return this.service.findAll(parsed);
  }

  // ✅ FIND ONE (with optional isDeleted)
  @Get(':id')
  @ApiQuery({
    name: 'isDeleted',
    required: false,
    type: Boolean,
    description: 'true = deleted, false = active',
  })
  findOne(
    @Param('id') id: string,
    @Query('isDeleted') isDeleted?: string,
  ) {
    const parsed =
      isDeleted !== undefined ? isDeleted === 'true' : undefined;

    return this.service.findOne(+id, parsed);
  }

  // ✅ UPDATE
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCenterDto,
  ) {
    return this.service.update(+id, dto);
  }

  // ✅ SOFT DELETE
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }

  // 🔥 BONUS: RESTORE API
  @Put('restore/:id')
  restore(@Param('id') id: string) {
    return this.service.restore(+id);
  }
}