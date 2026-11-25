import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePaymentDto, UpdatePaymentStatusDto } from './dto/create-payment.dto';
import { Payment, PaymentStatus } from './entities/payment.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepo: Repository<Payment>,
  ) {}

  async create(dto: CreatePaymentDto) {
    const payment = this.paymentsRepo.create({
      studentId: dto.studentId,
      courseId: dto.courseId,
      amount: dto.amount,
      currency: (dto.currency ?? 'MXN').toUpperCase(),
      paymentMethod: dto.paymentMethod,
      status: dto.status ?? PaymentStatus.COMPLETED,
    });

    return this.paymentsRepo.save(payment);
  }

  async findAll() {
    return this.paymentsRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findByStudent(studentId: string) {
    return this.paymentsRepo.find({
      where: { studentId },
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(id: string, dto: UpdatePaymentStatusDto) {
    const payment = await this.paymentsRepo.findOne({ where: { id } });
    if (!payment) {
      throw new NotFoundException(`Pago con ID ${id} no encontrado`);
    }

    payment.status = dto.status;
    return this.paymentsRepo.save(payment);
  }
}
