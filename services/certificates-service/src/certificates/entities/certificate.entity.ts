import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('certificates')
@Unique(['studentId', 'courseId'])
export class Certificate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'student_id', type: 'uuid' })
  studentId: string;

  @Column({ name: 'course_id', type: 'uuid' })
  courseId: string;

  @Column({ name: 'certificate_code', unique: true })
  certificateCode: string;

  @Column({ name: 'recipient_name', nullable: true })
  recipientName?: string;

  @Column({ name: 'course_title', nullable: true })
  courseTitle?: string;

  @CreateDateColumn({ name: 'issued_at' })
  issuedAt: Date;
}
