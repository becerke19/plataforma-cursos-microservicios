import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class IssueCertificateDto {
  @IsUUID()
  @IsNotEmpty()
  studentId: string;

  @IsUUID()
  @IsNotEmpty()
  courseId: string;

  @IsString()
  @IsOptional()
  @MaxLength(150)
  recipientName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  courseTitle?: string;
}
