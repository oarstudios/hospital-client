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

import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';

import {
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

// ─── Multer storage (same pattern as centers) ────────────────────────────────
const multerStorage = diskStorage({
  destination: (_req, _file, cb) => {
    const uploadPath = join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (_req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + extname(file.originalname));
  },
});

// ─── Group AnyFiles into named buckets ───────────────────────────────────────
function groupFiles(files: Express.Multer.File[]) {
  const image: Express.Multer.File[] = [];

  for (const f of files || []) {
    if (f.fieldname === 'image') image.push(f);
  }

  return { image };
}

@ApiTags('Blogs')
@Controller('blogs')
export class BlogsController {

  constructor(private readonly service: BlogsService) {}

  private parseBoolean(value: any): boolean | undefined {
    if (value === undefined) return undefined;
    if (Array.isArray(value)) value = value[0];
    if (value === 'true'  || value === '1') return true;
    if (value === 'false' || value === '0') return false;
    return undefined;
  }

  // ✅ CREATE
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateBlogDto })
  @UseInterceptors(AnyFilesInterceptor({ storage: multerStorage, limits: { fieldSize: Infinity } }))
  create(
    @UploadedFiles() rawFiles: Express.Multer.File[],
    @Body() dto: CreateBlogDto,
  ) {
    return this.service.create(dto, groupFiles(rawFiles));
  }

  // ✅ FIND ALL
  @Get()
  @ApiQuery({ name: 'isDeleted', required: false, type: Boolean })
  findAll(@Query('isDeleted') isDeleted?: any) {
    return this.service.findAll(this.parseBoolean(isDeleted));
  }

  // ✅ FIND BY SLUG  — must be before :id to avoid route conflict
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.service.findBySlug(slug);
  }

  // ✅ FIND ONE
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('isDeleted') isDeleted?: any,
  ) {
    return this.service.findOne(+id, this.parseBoolean(isDeleted));
  }

  // ✅ RESTORE — must be before PUT(':id')
  @Put('restore/:id')
  restore(@Param('id') id: string) {
    return this.service.restore(+id);
  }

  // ✅ UPDATE
  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateBlogDto })
  @UseInterceptors(AnyFilesInterceptor({ storage: multerStorage,  limits: { fieldSize: Infinity } }))
  update(
    @Param('id') id: string,
    @UploadedFiles() rawFiles: Express.Multer.File[],
    @Body() dto: UpdateBlogDto,
  ) {
    return this.service.update(+id, dto, groupFiles(rawFiles));
  }

  // ✅ DELETE
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}