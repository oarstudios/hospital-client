import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';

import { Center } from './entities/center.entity';
import { Description } from '../../common/entities/description.entity';
import { Image } from '../../common/entities/image.entity';
import { EntityDescription } from '../../common/entities/entity-description.entity';
import { EntityImage } from '../../common/entities/entity-image.entity';

import { CreateCenterDto } from './dto/create-center.dto';
import { UpdateCenterDto } from './dto/update-center.dto';

import { DB_CONSTANTS } from '../../common/constants/db.constants';
import { deleteFiles } from '../../common/utils/file.util';

@Injectable()
export class CentersService {
  private ENTITY = 'center';

  constructor(
    @InjectRepository(Center)
    private readonly repo: Repository<Center>,

    @InjectRepository(Description)
    private readonly descRepo: Repository<Description>,

    @InjectRepository(EntityDescription)
    private readonly entityDescRepo: Repository<EntityDescription>,

    @InjectRepository(Image)
    private readonly imageRepo: Repository<Image>,

    @InjectRepository(EntityImage)
    private readonly entityImageRepo: Repository<EntityImage>,

    private readonly dataSource: DataSource,
  ) {}

  private normalizeDescription(input: any): string[] {
    if (!input) return [];
    if (Array.isArray(input)) return input;
    if (typeof input === 'string') return [input];
    return [];
  }

  // ✅ CREATE
 async create(dto: CreateCenterDto, files: any) {
  try {
    return await this.dataSource.transaction(async (manager) => {
      const existing = await manager.findOne(Center, {
        where: { slug: dto.slug },
      });

      if (existing) {
        deleteFiles(files);
        throw new BadRequestException('Slug already exists');
      }

      const heroImage = files?.heroImage?.[0]?.filename;
      const centerImage = files?.centerImage?.[0]?.filename;

      const center = await manager.save(Center, {
        ...dto,
        heroImage: heroImage ? `/uploads/${heroImage}` : null,
        centerImage: centerImage ? `/uploads/${centerImage}` : null,
      });

      // 🔥 DESCRIPTIONS
      const descArray = this.normalizeDescription(dto.description);

      let dIndex = 0;
      for (const text of descArray) {
        const desc = await manager.save(Description, {
          content: text,
        });

        await manager.save(EntityDescription, {
          entityId: center.id,
          entityType: this.ENTITY,
          descriptionId: desc.id,
          sequence: dIndex++,
        });
      }

      // 🔥 GALLERY
      let gIndex = 0;
      for (const file of files?.gallery || []) {
        const image = await manager.save(Image, {
          url: `/uploads/${file.filename}`,
        });

        await manager.save(EntityImage, {
          entityId: center.id,
          entityType: this.ENTITY,
          imageId: image.id,
          sequence: gIndex++,
        });
      }

      // 🔥 FETCH USING SAME MANAGER (CRITICAL FIX)

      const descTxn = await manager.find(EntityDescription, {
        where: { entityId: center.id, entityType: this.ENTITY },
        order: { sequence: 'ASC' },
      });

      const descIds = descTxn.map((d) => d.descriptionId);

      const descriptions = descIds.length
        ? await manager.findBy(Description, { id: In(descIds) })
        : [];

      const imgTxn = await manager.find(EntityImage, {
        where: { entityId: center.id, entityType: this.ENTITY },
        order: { sequence: 'ASC' },
      });

      const imgIds = imgTxn.map((i) => i.imageId);

      const images = imgIds.length
        ? await manager.findBy(Image, { id: In(imgIds) })
        : [];

      return {
  ...center,
  description: descriptions.map((d) => d.content),
  gallery: images.map((i) => i.url),
};
    });
  } catch (error) {
    deleteFiles(files);
    throw error;
  }
}

  // ✅ FIND ALL (OPTIMIZED)
  async findAll(isDeleted?: boolean) {
    const filter =
      typeof isDeleted === 'boolean'
        ? isDeleted
        : DB_CONSTANTS.IS_DELETED.NO;

    const centers = await this.repo.find({
      where: { isDeleted: filter },
      order: { createdAt: 'DESC' },
    });

    if (!centers.length) {
      return [];
    }

    const centerIds = centers.map((c) => c.id);

    // 🔥 fetch all descriptions in ONE go
    const descTxn = await this.entityDescRepo.find({
      where: {
        entityId: In(centerIds),
        entityType: this.ENTITY,
      },
      order: { sequence: 'ASC' },
    });

    const descIds = descTxn.map((d) => d.descriptionId);

    const descriptions = descIds.length
      ? await this.descRepo.findBy({ id: In(descIds) })
      : [];

    const descMap = new Map<number, string[]>();

    descTxn.forEach((txn) => {
      const desc = descriptions.find((d) => d.id === txn.descriptionId);
      if (!desc) return;

      if (!descMap.has(txn.entityId)) {
        descMap.set(txn.entityId, []);
      }

      descMap.get(txn.entityId)!.push(desc.content);
    });

    // 🔥 fetch all images in ONE go
    const imgTxn = await this.entityImageRepo.find({
      where: {
        entityId: In(centerIds),
        entityType: this.ENTITY,
      },
      order: { sequence: 'ASC' },
    });

    const imgIds = imgTxn.map((i) => i.imageId);

    const images = imgIds.length
      ? await this.imageRepo.findBy({ id: In(imgIds) })
      : [];

    const imgMap = new Map<number, string[]>();

    imgTxn.forEach((txn) => {
      const img = images.find((i) => i.id === txn.imageId);
      if (!img) return;

      if (!imgMap.has(txn.entityId)) {
        imgMap.set(txn.entityId, []);
      }

      imgMap.get(txn.entityId)!.push(img.url);
    });

    const result = centers.map((center) => ({
      ...center,
      description: descMap.get(center.id) || [],
      gallery: imgMap.get(center.id) || [],
    }));

   return result;
  }

  // ✅ FIND ONE
  async findOne(id: number, isDeleted?: boolean) {
    const filter =
      typeof isDeleted === 'boolean'
        ? isDeleted
        : DB_CONSTANTS.IS_DELETED.NO;

    const center = await this.repo.findOne({
      where: { id, isDeleted: filter },
    });

    if (!center) throw new NotFoundException('Center not found');

    const descTxn = await this.entityDescRepo.find({
      where: { entityId: id, entityType: this.ENTITY },
      order: { sequence: 'ASC' },
    });

    const descIds = descTxn.map((d) => d.descriptionId);

    const descriptions = descIds.length
      ? await this.descRepo.findBy({ id: In(descIds) })
      : [];

    const imgTxn = await this.entityImageRepo.find({
      where: { entityId: id, entityType: this.ENTITY },
      order: { sequence: 'ASC' },
    });

    const imgIds = imgTxn.map((i) => i.imageId);

    const images = imgIds.length
      ? await this.imageRepo.findBy({ id: In(imgIds) })
      : [];

    return {
        ...center,
        description: descriptions.map((d) => d.content),
        gallery: images.map((i) => i.url),
    };
  }

  // ✅ UPDATE
  async update(id: number, dto: UpdateCenterDto, files?: any) {
    return await this.dataSource.transaction(async (manager) => {
      const center = await manager.findOne(Center, {
        where: { id, isDeleted: false },
      });

      if (!center) throw new NotFoundException('Center not found');

      if (dto.slug && dto.slug !== center.slug) {
        const exists = await manager.findOne(Center, {
          where: { slug: dto.slug },
        });

        if (exists) {
          throw new BadRequestException('Slug already exists');
        }
      }

      // replace descriptions
      if (dto.description !== undefined) {
        const txn = await manager.find(EntityDescription, {
          where: { entityId: id, entityType: this.ENTITY },
        });

        const descIds = txn.map((t) => t.descriptionId);

        await manager.delete(EntityDescription, {
          entityId: id,
          entityType: this.ENTITY,
        });

        if (descIds.length) {
          await manager.delete(Description, descIds as any);
        }

        const descArray = this.normalizeDescription(dto.description);

        let index = 0;
        for (const text of descArray) {
          const desc = await manager.save(Description, {
            content: text,
          });

          await manager.save(EntityDescription, {
            entityId: id,
            entityType: this.ENTITY,
            descriptionId: desc.id,
            sequence: index++,
          });
        }
      }

      // replace gallery
      if (files?.gallery) {
        const txn = await manager.find(EntityImage, {
          where: { entityId: id, entityType: this.ENTITY },
        });

        const imageIds = txn.map((t) => t.imageId);

        await manager.delete(EntityImage, {
          entityId: id,
          entityType: this.ENTITY,
        });

        if (imageIds.length) {
          const oldImages = await manager.findBy(Image, {
            id: imageIds as any,
          });

          oldImages.forEach((img) => {
            const filename = img.url.replace('/uploads/', '');
            deleteFiles({ gallery: [{ filename }] });
          });

          await manager.delete(Image, imageIds as any);
        }

        let index = 0;
        for (const file of files.gallery) {
          const image = await manager.save(Image, {
            url: `/uploads/${file.filename}`,
          });

          await manager.save(EntityImage, {
            entityId: id,
            entityType: this.ENTITY,
            imageId: image.id,
            sequence: index++,
          });
        }
      }

      Object.assign(center, dto);
      await manager.save(center);

      return await this.findOne(id);
    });
  }

  // ✅ DELETE
  async remove(id: number) {
    const center = await this.repo.findOne({
      where: { id, isDeleted: false },
    });

    if (!center) throw new NotFoundException('Center not found');

    center.isDeleted = true;
    await this.repo.save(center);

    return [];
  }

  // ✅ RESTORE
  async restore(id: number) {
    const center = await this.repo.findOne({
      where: { id, isDeleted: true },
    });

    if (!center) throw new NotFoundException('Center not found');

    center.isDeleted = false;
    await this.repo.save(center);

    return center;
  }
}