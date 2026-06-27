import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

import { DB_CONSTANTS } from '../../common/constants/db.constants';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly repo: Repository<Appointment>,
  ) {}

  // ✅ CREATE — public endpoint, hit by the website booking forms
  async create(dto: CreateAppointmentDto) {
    const appointment = await this.repo.save({
      ...dto,
      source: dto.source || 'Website_Form',
      status: dto.status || 'Pending',
    });

    return appointment;
  }

  // ✅ FIND ALL — used by the admin Manage Appointments table
  async findAll(isDeleted?: boolean) {
    const filter =
      typeof isDeleted === 'boolean' ? isDeleted : DB_CONSTANTS.IS_DELETED.NO;

    return this.repo.find({
      where: { isDeleted: filter },
      order: { createdAt: 'ASC' }, // first-come-first-served: oldest created shows first
    });
  }

  // ✅ FIND ONE
  async findOne(id: number, isDeleted?: boolean) {
    const filter =
      typeof isDeleted === 'boolean' ? isDeleted : DB_CONSTANTS.IS_DELETED.NO;

    const appointment = await this.repo.findOne({
      where: { id, isDeleted: filter },
    });

    if (!appointment) throw new NotFoundException('Appointment not found');
    return appointment;
  }

  // ✅ UPDATE — e.g. admin marking Confirmed / Cancelled
  async update(id: number, dto: UpdateAppointmentDto) {
    const appointment = await this.repo.findOne({ where: { id } });
    if (!appointment) throw new NotFoundException('Appointment not found');

    Object.assign(appointment, dto);
    return this.repo.save(appointment);
  }

  // ✅ REMOVE (soft delete)
  async remove(id: number) {
    const appointment = await this.repo.findOne({
      where: { id, isDeleted: false },
    });
    if (!appointment) throw new NotFoundException('Appointment not found');

    appointment.isDeleted = true;
    await this.repo.save(appointment);

    return [];
  }

  // ✅ RESTORE
  async restore(id: number) {
    const appointment = await this.repo.findOne({
      where: { id, isDeleted: true },
    });
    if (!appointment) throw new NotFoundException('Appointment not found');

    appointment.isDeleted = false;
    await this.repo.save(appointment);

    return appointment;
  }

  // ✅ STATS — used by the admin dashboard to show total booking count
  async getStats() {
    const [total, pending, confirmed, cancelled] = await Promise.all([
      this.repo.count({ where: { isDeleted: false } }),
      this.repo.count({ where: { isDeleted: false, status: 'Pending' } }),
      this.repo.count({ where: { isDeleted: false, status: 'Confirmed' } }),
      this.repo.count({ where: { isDeleted: false, status: 'Cancelled' } }),
    ]);

    return {
      totalAppointments: total,
      pending,
      confirmed,
      cancelled,
    };
  }
}