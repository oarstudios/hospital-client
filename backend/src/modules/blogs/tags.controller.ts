import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';

@ApiTags('Tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly service: TagsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  // Used by the admin blog form's "type a new tag" flow — creates the
  // tag (or returns the existing one if it already exists) so it gets
  // a real id to attach to the blog being saved.
  @Post()
  create(@Body() dto: CreateTagDto) {
    return this.service.create(dto);
  }
}