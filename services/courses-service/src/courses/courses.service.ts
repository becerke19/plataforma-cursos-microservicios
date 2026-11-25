import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { CreateModuleDto } from './dto/create-module.dto';
import { Course, CourseStatus } from './entities/course.entity';
import { Lesson } from './entities/lesson.entity';
import { Module } from './entities/module.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly coursesRepo: Repository<Course>,
    @InjectRepository(Module)
    private readonly modulesRepo: Repository<Module>,
    @InjectRepository(Lesson)
    private readonly lessonsRepo: Repository<Lesson>,
  ) {}

  async createCourse(dto: CreateCourseDto) {
    const course = this.coursesRepo.create({
      title: dto.title.trim(),
      description: dto.description?.trim(),
      instructorId: dto.instructorId,
      status: dto.status ?? CourseStatus.DRAFT,
    });
    return this.coursesRepo.save(course);
  }

  async findAllCourses() {
    return this.coursesRepo.find({
      relations: ['modules', 'modules.lessons'],
      order: { createdAt: 'DESC' },
    });
  }

  async findCourseById(id: string) {
    const course = await this.coursesRepo.findOne({
      where: { id },
      relations: ['modules', 'modules.lessons'],
    });
    if (!course) {
      throw new NotFoundException('Curso no encontrado');
    }
    return course;
  }

  async addModule(courseId: string, dto: CreateModuleDto) {
    const course = await this.findCourseById(courseId);
    const mod = this.modulesRepo.create({
      title: dto.title.trim(),
      order: dto.order ?? (course.modules?.length ?? 0) + 1,
      course,
    });
    return this.modulesRepo.save(mod);
  }

  async addLesson(moduleId: string, dto: CreateLessonDto) {
    const mod = await this.modulesRepo.findOne({
      where: { id: moduleId },
      relations: ['lessons'],
    });
    if (!mod) {
      throw new NotFoundException('Módulo no encontrado');
    }
    const lesson = this.lessonsRepo.create({
      title: dto.title.trim(),
      content: dto.content?.trim(),
      videoUrl: dto.videoUrl?.trim(),
      order: dto.order ?? (mod.lessons?.length ?? 0) + 1,
      module: mod,
    });
    return this.lessonsRepo.save(lesson);
  }
}