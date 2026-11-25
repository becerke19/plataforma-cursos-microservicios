import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { CreateModuleDto } from './dto/create-module.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  create(@Body() dto: CreateCourseDto) {
    return this.coursesService.createCourse(dto);
  }

  @Get()
  findAll() {
    return this.coursesService.findAllCourses();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findCourseById(id);
  }

  @Post(':id/modules')
  addModule(@Param('id') id: string, @Body() dto: CreateModuleDto) {
    return this.coursesService.addModule(id, dto);
  }

  @Post('modules/:moduleId/lessons')
  addLesson(
    @Param('moduleId') moduleId: string,
    @Body() dto: CreateLessonDto,
  ) {
    return this.coursesService.addLesson(moduleId, dto);
  }
}