import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/libs/prisma/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoiceResponseDto } from './dto/invoice-response.dto';
import { PaymentService } from '../payment/payment.service';
import { DayjsService } from 'src/libs/dayjs';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dayjs: DayjsService,
    private readonly paymentService: PaymentService,
  ) {}

  async create(
    createInvoiceDto: CreateInvoiceDto,
  ): Promise<InvoiceResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: createInvoiceDto.userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const plan = await this.prisma.plan.findUnique({
      where: { id: createInvoiceDto.planId },
    });

    if (!plan) {
      throw new Error('Plan not found');
    }

    const now = this.dayjs.now().toDate();
    const subscription = await this.prisma.subscription.create({
      data: {
        userId: user.id,
        planId: plan.id,
        status: 'AWAITING_PAYMENT',
        startDate: now,
        currentPeriodStart: now,
        currentPeriodEnd: this.dayjs.utc().add(30, 'days').toDate(),
      },
    });

    const invoice = await this.prisma.invoice.create({
      data: {
        subscriptionId: subscription.id,
        total: plan.pricePerMonth,
      },
    });

    //Зразу конвертуєм в копійки страйп завжди хоче копійках
    const amountCents = parseInt(invoice.total.mul(100).toFixed(0), 10);

    // імітуєм запит в страйп з мок данимит
    const stripeSession = await this.paymentService.createStripeSession(
      invoice.id,
      amountCents,
    );

    // додаєм замокану id сесії з страйпу
    const updatedInvoice = await this.prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        stripeSessionId: stripeSession.id,
      },
    });

    return {
      ...this.mapToDto(updatedInvoice),
      checkoutUrl: stripeSession.checkoutUrl,
    };
  }

  async update(
    id: string,
    updateInvoiceDto: UpdateInvoiceDto,
  ): Promise<InvoiceResponseDto> {
    const invoice = await this.prisma.invoice.update({
      where: { id },
      data: updateInvoiceDto,
    });
    return this.mapToDto(invoice);
  }

  async handleWebhook(stripeSessionId: string): Promise<InvoiceResponseDto> {
    const paymentConfirmation =
      await this.paymentService.mockPaymentWebhook(stripeSessionId);

    // Update invoice as paid
    const invoice = await this.prisma.invoice.update({
      where: { stripeSessionId },
      data: {
        paid: true,
        stripePaymentId: paymentConfirmation.payment_intent,
      },
    });

    const subscription = await this.prisma.subscription.update({
      where: { id: invoice.subscriptionId! },
      data: {
        status: 'ACTIVE',
      },
    });

    await this.prisma.billingTransaction.create({
      data: {
        amount: invoice.total,
        type: 'CHARGE',
        invoiceId: invoice.id,
        subscriptionId: subscription.id,
      },
    });
    return this.mapToDto(invoice);
  }

  private mapToDto(invoice: any): InvoiceResponseDto {
    return {
      id: invoice.id,
      subscriptionId: invoice.subscriptionId,
      total: invoice.total.toNumber(), // Convert Decimal to number
      issuedAt: invoice.issuedAt,
      dueDate: invoice.dueDate || undefined,
      paid: invoice.paid,
      stripeSessionId: invoice.stripeSessionId || undefined,
      stripePaymentId: invoice.stripePaymentId || undefined,
    };
  }
}
