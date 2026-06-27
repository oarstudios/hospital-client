import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';

import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly service: AppointmentsService) {}

  private parseBoolean(value: any): boolean | undefined {
    if (value === undefined) return undefined;
    if (Array.isArray(value)) value = value[0];
    if (value === 'true' || value === '1') return true;
    if (value === 'false' || value === '0') return false;
    return undefined;
  }

  // ✅ CREATE — public, hit directly by the website's Book Appointment forms
  @Post()
  create(@Body() dto: CreateAppointmentDto) {
    return this.service.create(dto);
  }

  // ✅ FIND ALL — admin Manage Appointments table
  @Get()
  @ApiQuery({ name: 'isDeleted', required: false, type: Boolean })
  findAll(@Query('isDeleted') isDeleted?: any) {
    return this.service.findAll(this.parseBoolean(isDeleted));
  }

  // ✅ STATS — admin dashboard count card
  @Get('stats')
  getStats() {
    return this.service.getStats();
  }

  // ✅ FIND ONE
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('isDeleted') isDeleted?: any,
  ) {
    return this.service.findOne(+id, this.parseBoolean(isDeleted));
  }

  // ✅ RESTORE — must be before PUT(':id') to avoid route conflict
  @Put('restore/:id')
  restore(@Param('id') id: string) {
    return this.service.restore(+id);
  }

  // ✅ UPDATE — e.g. admin changing status to Confirmed / Cancelled
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAppointmentDto) {
    return this.service.update(+id, dto);
  }

  // ✅ DELETE (soft)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}