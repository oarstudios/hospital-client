import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Center } from './entities/center.entity';
import { CentersService } from './centers.service';
import { CentersController } from './centers.controller';
import { Description } from '../../common/entities/description.entity';
import { Image } from '../../common/entities/image.entity';
import { EntityImage } from '../../common/entities/entity-image.entity';
import { EntityDescription } from '../../common/entities/entity-description.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ Center,
  Description,
  Image,
  EntityDescription,
  EntityImage,])],
  controllers: [CentersController],
  providers: [CentersService],
})
export class CentersModule {}