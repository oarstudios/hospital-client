import { Module } from '@nestjs/common';
import { OthersController } from './others.controller';
import { OthersService } from './others.service';

@Module({
  controllers: [OthersController],
  providers: [OthersService],
})
export class OthersModule {}
  