import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { UpsertLessonProgressDto } from './dto/upsert-lesson-progress.dto';
import { ProgressService } from './progress.service';

@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post('lessons')
  upsertLesson(@Body() dto: UpsertLessonProgressDto) {
    return this.progressService.markLessonProgress(dto);
  }

  @Get('students/:studentId/courses/:courseId')
  getCourseProgress(
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Param('courseId', ParseUUIDPipe) courseId: string,
  ) {
    return this.progressService.getStudentCourseProgress(studentId, courseId);
  }
}
