import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { Repository } from 'typeorm';
import { IssueCertificateDto } from './dto/issue-certificate.dto';
import { Certificate } from './entities/certificate.entity';

@Injectable()
export class CertificatesService {
  constructor(
    @InjectRepository(Certificate)
    private readonly certificatesRepo: Repository<Certificate>,
  ) {}

  private generateCertificateCode(): string {
    const token = randomBytes(4).toString('hex').toUpperCase();
    return `CERT-${Date.now().toString(36).toUpperCase()}-${token}`;
  }

  async issueCertificate(dto: IssueCertificateDto) {
    const existing = await this.certificatesRepo.findOne({
      where: {
        studentId: dto.studentId,
        courseId: dto.courseId,
      },
    });

    if (existing) {
      if (dto.recipientName) existing.recipientName = dto.recipientName;
      if (dto.courseTitle) existing.courseTitle = dto.courseTitle;
      return this.certificatesRepo.save(existing);
    }

    const certificate = this.certificatesRepo.create({
      studentId: dto.studentId,
      courseId: dto.courseId,
      recipientName: dto.recipientName,
      courseTitle: dto.courseTitle,
      certificateCode: this.generateCertificateCode(),
    });

    return this.certificatesRepo.save(certificate);
  }

  async findByStudent(studentId: string) {
    return this.certificatesRepo.find({
      where: { studentId },
      order: { issuedAt: 'DESC' },
    });
  }

  async findByCode(code: string) {
    const cert = await this.certificatesRepo.findOne({
      where: { certificateCode: code },
    });

    if (!cert) {
      throw new NotFoundException(`Certificado con código ${code} no encontrado`);
    }

    return cert;
  }
}
