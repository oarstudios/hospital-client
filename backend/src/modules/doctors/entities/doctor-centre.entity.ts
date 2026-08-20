import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ schema: 'hospital', name: 'doctor_centres' })
export class DoctorCentre {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  doctorId!: number;

  @Column()
  centreId!: number;

  // ✅ Doctor-specific map link for this centre (falls back to the centre's
  // own mapLink on the frontend when not set). Lets admins point a doctor's
  // profile at a specific pin/branch entrance instead of the shared centre link.
  @Column({ type: 'text', nullable: true })
  mapLink?: string;

  @CreateDateColumn()
  createdAt!: Date;
}