import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpsertLessonProgressDto } from './dto/upsert-lesson-progress.dto';
import { LessonProgress } from './entities/lesson-progress.entity';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(LessonProgress)
    private readonly progressRepo: Repository<LessonProgress>,
  ) {}

  async markLessonProgress(dto: UpsertLessonProgressDto) {
    const completed = dto.completed ?? true;
    let record = await this.progressRepo.findOne({
      where: {
        studentId: dto.studentId,
        lessonId: dto.lessonId,
      },
    });

    if (!record) {
      record = this.progressRepo.create({
        studentId: dto.studentId,
        courseId: dto.courseId,
        lessonId: dto.lessonId,
        completed,
        completedAt: completed ? new Date() : undefined,
      });
    } else {
      record.courseId = dto.courseId;
      record.completed = completed;
      record.completedAt = completed ? (record.completedAt ?? new Date()) : undefined;
    }

    return this.progressRepo.save(record);
  }

  async getStudentCourseProgress(studentId: string, courseId: string) {
    const records = await this.progressRepo.find({
      where: { studentId, courseId },
      order: { updatedAt: 'DESC' },
    });

    const completedLessons = records.filter((r) => r.completed).length;

    return {
      studentId,
      courseId,
      completedLessons,
      trackedLessons: records.length,
      lessons: records,
    };
  }
}
