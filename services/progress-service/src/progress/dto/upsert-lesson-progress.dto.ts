import { IsBoolean, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class UpsertLessonProgressDto {
  @IsUUID()
  @IsNotEmpty()
  studentId: string;

  @IsUUID()
  @IsNotEmpty()
  courseId: string;

  @IsUUID()
  @IsNotEmpty()
  lessonId: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
