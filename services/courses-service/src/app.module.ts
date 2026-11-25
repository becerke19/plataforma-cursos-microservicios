import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envValidationSchema } from './config/env.validation';
import { CoursesModule } from './courses/courses.module';
import { Course } from './courses/entities/course.entity';
import { Lesson } from './courses/entities/lesson.entity';
import { Module as CourseModule } from './courses/entities/module.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5433),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME', 'courses_db'),
        entities: [Course, CourseModule, Lesson],
        synchronize: config.get<string>('NODE_ENV') !== 'production',
      }),
    }),
    CoursesModule,
  ],
})
export class AppModule {}