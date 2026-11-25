import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { IssueCertificateDto } from './dto/issue-certificate.dto';

@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Post()
  issue(@Body() dto: IssueCertificateDto) {
    return this.certificatesService.issueCertificate(dto);
  }

  @Get('students/:studentId')
  byStudent(@Param('studentId', ParseUUIDPipe) studentId: string) {
    return this.certificatesService.findByStudent(studentId);
  }

  @Get('verify/:code')
  verifyByCode(@Param('code') code: string) {
    return this.certificatesService.findByCode(code);
  }
}
