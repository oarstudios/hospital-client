import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Center } from './entities/center.entity';
import { CreateCenterDto } from './dto/create-center.dto';
import { UpdateCenterDto } from './dto/update-center.dto';

import { DB_CONSTANTS } from '../../common/constants/db.constants';

@Injectable()
export class CentersService {
  constructor(
    @InjectRepository(Center)
    private readonly repo: Repository<Center>,
  ) {}

  // ✅ CREATE
  async create(dto: CreateCenterDto, files: any) {
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
  }

  // ✅ FIND ALL (with optional isDeleted filter)
  async findAll(isDeleted?: boolean) {
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
  }

  // ✅ FIND ONE
  async findOne(id: number, isDeleted?: boolean) {
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
  }

  // ✅ UPDATE
  async update(id: number, dto: UpdateCenterDto) {
    const center = await this.repo.findOne({
      where: { id, isDeleted: DB_CONSTANTS.IS_DELETED.NO },
    });

    if (!center) throw new NotFoundException('Center not found');

    Object.assign(center, dto);

    await this.repo.save(center);

    return {
      message: 'Center updated successfully',
      data: center,
    };
  }

  // ✅ SOFT DELETE
  async remove(id: number) {
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
  }

  // ✅ RESTORE (BONUS 🔥)
  async restore(id: number) {
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
  }
}