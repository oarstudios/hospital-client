import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Center } from './entities/center.entity';
import { CreateCenterDto } from './dto/create-center.dto';
import { UpdateCenterDto } from './dto/update-center.dto';

import { DB_CONSTANTS } from '../../common/constants/db.constants';
import { deleteFiles } from '../../common/utils/file.util';

@Injectable()
export class CentersService {
  constructor(
    @InjectRepository(Center)
    private readonly repo: Repository<Center>,
  ) {}

  // ✅ CREATE
  async create(dto: CreateCenterDto, files: any) {
    try {
      // 🔥 Check duplicate before saving
      const existing = await this.repo.findOne({
        where: { slug: dto.slug },
      });

      if (existing) {
        deleteFiles(files);
        throw new BadRequestException('Slug already exists');
      }

      const heroImage = files?.heroImage?.[0]?.filename;
      const centerImage = files?.centerImage?.[0]?.filename;

      const gallery =
        files?.gallery?.map((file) => `/uploads/${file.filename}`) || [];

      const center = this.repo.create({
        ...dto,
        heroImage: heroImage ? `/uploads/${heroImage}` : null,
        centerImage: centerImage ? `/uploads/${centerImage}` : null,
        gallery,
      });

      await this.repo.save(center);

      return {
        message: 'Center created successfully',
        data: center,
      };
    } catch (error) {
      // ❗ cleanup uploaded files
      deleteFiles(files);
      throw error;
    }
  }

  // ✅ FIND ALL
  async findAll(isDeleted?: boolean) {
    try {
      const whereCondition = {
        isDeleted:
          typeof isDeleted === 'boolean'
            ? isDeleted
            : DB_CONSTANTS.IS_DELETED.NO,
      };

      const data = await this.repo.find({
        where: whereCondition,
        order: { createdAt: 'DESC' },
      });

      return {
        message: 'Centers fetched successfully',
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  // ✅ FIND ONE
  async findOne(id: number, isDeleted?: boolean) {
    try {
      const center = await this.repo.findOne({
        where: {
          id,
          isDeleted:
            typeof isDeleted === 'boolean'
              ? isDeleted
              : DB_CONSTANTS.IS_DELETED.NO,
        },
      });

      if (!center) throw new NotFoundException('Center not found');

      return {
        message: 'Center fetched successfully',
        data: center,
      };
    } catch (error) {
      throw error;
    }
  }

  // ✅ UPDATE
  async update(id: number, dto: UpdateCenterDto) {
    try {
      const center = await this.repo.findOne({
        where: { id, isDeleted: DB_CONSTANTS.IS_DELETED.NO },
      });

      if (!center) throw new NotFoundException('Center not found');

      // 🔥 If slug updated → check duplicate
      if (dto.slug && dto.slug !== center.slug) {
        const existing = await this.repo.findOne({
          where: { slug: dto.slug },
        });

        if (existing) {
          throw new BadRequestException('Slug already exists');
        }
      }

      Object.assign(center, dto);

      await this.repo.save(center);

      return {
        message: 'Center updated successfully',
        data: center,
      };
    } catch (error) {
      throw error;
    }
  }

  // ✅ SOFT DELETE
  async remove(id: number) {
    try {
      const center = await this.repo.findOne({
        where: { id, isDeleted: DB_CONSTANTS.IS_DELETED.NO },
      });

      if (!center) throw new NotFoundException('Center not found');

      center.isDeleted = DB_CONSTANTS.IS_DELETED.YES;

      await this.repo.save(center);

      return {
        message: 'Center deleted successfully',
        data: [],
      };
    } catch (error) {
      throw error;
    }
  }

  // ✅ RESTORE
  async restore(id: number) {
    try {
      const center = await this.repo.findOne({
        where: { id, isDeleted: DB_CONSTANTS.IS_DELETED.YES },
      });

      if (!center) throw new NotFoundException('Center not found');

      center.isDeleted = DB_CONSTANTS.IS_DELETED.NO;

      await this.repo.save(center);

      return {
        message: 'Center restored successfully',
        data: center,
      };
    } catch (error) {
      throw error;
    }
  }
}