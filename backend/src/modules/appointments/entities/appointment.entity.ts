import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { DB_CONSTANTS } from '../../../common/constants/db.constants';

@Entity({ schema: 'hospital', name: 'appointments' })
export class Appointment {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  patientName!: string;

  @Column({ type: 'int', nullable: true })
  age?: number;

  @Column()
  phone!: string;

  @Column({ nullable: true })
  area?: string;

  // Center name as selected on the form (kept as a plain string so the
  // booking still records the chosen centre even if it is later renamed)
  @Column({ nullable: true })
  center?: string;

  // Link to the actual Center row, when known (e.g. booked from a
  // specific center's page rather than the general homepage form)
  @Column({ type: 'int', nullable: true })
  centerId?: number;

  @Column({ type: 'date', nullable: true })
  appointmentDate?: string;

  // Where the booking came from: Website_Form (home page) or Center_Page
  @Column({ default: 'Website_Form' })
  source!: string;

  // Pending / Confirmed / Cancelled — admin can update this from the dashboard
  @Column({ default: 'Pending' })
  status!: string;

  // ✅ Soft delete flag
  @Column({
    type: 'boolean',
    default: DB_CONSTANTS.IS_DELETED.NO,
  })
  isDeleted!: boolean;

  // ✅ Auto timestamps
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}