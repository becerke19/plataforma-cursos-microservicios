import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Module } from './module.entity';

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 180 })
  title: string;

  @Column({ type: 'text', nullable: true })
  content?: string;

  @Column({ name: 'video_url', nullable: true })
  videoUrl?: string;

  @Column({ type: 'int', default: 1 })
  order: number;

  @ManyToOne(() => Module, (mod) => mod.lessons, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'module_id' })
  module: Module;
}