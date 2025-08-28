import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/libs/prisma/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoiceResponseDto } from './dto/invoice-response.dto';
import { PaymentService } from '../payment/payment.service';
import { DayjsService } from 'src/libs/dayjs';
import { Prisma } from '@prisma/client';

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

    // Перевірити наявність активної підписки
    const activeSubscription = await this.prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: 'ACTIVE',
      },
    });

    let invoiceTotal = plan.pricePerMonth;
    let daysRemaining = 0;

    if (activeSubscription) {
      if (activeSubscription.planId === createInvoiceDto.planId) {
        throw new Error('You are already subscribed to this plan');
      }

      // Рахуємо дні що ще залишились на тарифі
      const now = this.dayjs.now();
      const periodEnd = this.dayjs.utc(activeSubscription.currentPeriodEnd);
      daysRemaining = periodEnd.diff(now, 'day');

      if (daysRemaining > 0) {
        const currentPlan = await this.prisma.plan.findUnique({
          where: { id: activeSubscription.planId },
        });

        if (currentPlan) {
          // Розрахувати денні ставки
          const currentDailyRate = currentPlan.pricePerMonth.div(30);
          const newDailyRate = plan.pricePerMonth.div(30);
          const creditAmount = currentDailyRate
            .minus(newDailyRate)
            .times(daysRemaining);

          if (creditAmount.gt(0)) {
            // Створити кредитну транзакцію для зниження рейтингу
            await this.prisma.billingTransaction.create({
              data: {
                amount: creditAmount,
                type: 'CREDIT',
                subscriptionId: activeSubscription.id,
              },
            });
          } else if (creditAmount.lt(0)) {
            // Calculate upgrade fee (absolute value of negative credit)
            const upgradeFee = creditAmount.negated();
            // Add upgrade fee to invoice total
            invoiceTotal = invoiceTotal.plus(upgradeFee);
          }
        }
      }

      // Deactivate current subscription
      await this.prisma.subscription.update({
        where: { id: activeSubscription.id },
        data: { status: 'CANCELED' },
      });
    }

    // Find available credits for the user
    const credits = await this.prisma.billingTransaction.findMany({
      where: {
        subscription: {
          userId: user.id,
        },
        type: 'CREDIT',
        invoiceId: null, // Unused credits
      },
    });

    const totalCredit = credits.reduce(
      (sum, credit) => sum.plus(credit.amount),
      new Prisma.Decimal(0),
    );
    let appliedCredit = new Prisma.Decimal(0);
    let remainingCredit = new Prisma.Decimal(0);

    // Apply credit to invoice
    if (totalCredit.gt(0)) {
      appliedCredit = totalCredit.gt(invoiceTotal) ? invoiceTotal : totalCredit;
      invoiceTotal = invoiceTotal.minus(appliedCredit);
      remainingCredit = totalCredit.minus(appliedCredit);
    }

    const nowDate = this.dayjs.now().toDate();
    const subscription = await this.prisma.subscription.create({
      data: {
        userId: user.id,
        planId: plan.id,
        status: 'AWAITING_PAYMENT',
        startDate: nowDate,
        currentPeriodStart: nowDate,
        currentPeriodEnd: this.dayjs.utc().add(30, 'days').toDate(),
      },
    });

    const invoice = await this.prisma.invoice.create({
      data: {
        subscriptionId: subscription.id,
        total: invoiceTotal,
      },
    });

    // використання кредиту
    if (appliedCredit.gt(0)) {
      // Позначити використані кредити як застосовані
      await this.prisma.billingTransaction.updateMany({
        where: {
          id: { in: credits.map((c) => c.id) },
        },
        data: { invoiceId: invoice.id },
      });

      // Створити транзакцію для використання кредиту
      // TODO: подивитись як виглядає таблиця billingTransaction коли є і кредити і звичайні гроші чи буде зрозуміло
      await this.prisma.billingTransaction.create({
        data: {
          amount: appliedCredit.negated(),
          type: 'ADJUSTMENT',
          subscriptionId: subscription.id,
          invoiceId: invoice.id,
        },
      });

      // Створити новий кредит для залишку балансу
      if (remainingCredit.gt(0)) {
        await this.prisma.billingTransaction.create({
          data: {
            amount: remainingCredit,
            type: 'CREDIT',
            subscriptionId: subscription.id,
          },
        });
      }
    }

    // Immediately activate subscription if fully covered by credits
    if (invoiceTotal.eq(0)) {
      await this.prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: 'ACTIVE' },
      });

      await this.prisma.invoice.update({
        where: { id: invoice.id },
        data: { paid: true },
      });

      return this.mapToDto(invoiceTotal);
    }

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

    // Оновіть рахунок-фактуру як оплачений
    const invoice = await this.prisma.invoice.update({
      where: { stripeSessionId },
      data: {
        paid: true,
        stripePaymentId: paymentConfirmation.payment_intent,
      },
    });

    const subscription = await this.prisma.subscription.findUnique({
      where: { id: invoice.subscriptionId! },
    });

    // Обробляти лише за наявності підписки, яка ще не активна
    if (subscription && subscription.status !== 'ACTIVE') {
      await this.prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: 'ACTIVE' },
      });

      await this.prisma.user.update({
        where: { id: subscription.userId },
        data: { activeSubscriptionId: subscription.id },
      });

      await this.prisma.billingTransaction.create({
        data: {
          amount: invoice.total,
          type: 'CHARGE',
          invoiceId: invoice.id,
          subscriptionId: subscription.id,
        },
      });
    }

    return this.mapToDto(invoice);
  }

  private mapToDto(invoice: any): InvoiceResponseDto {
    return {
      id: invoice.id,
      subscriptionId: invoice.subscriptionId,
      total: invoice.total.toNumber(),
      issuedAt: invoice.issuedAt,
      dueDate: invoice.dueDate || undefined,
      paid: invoice.paid,
      stripeSessionId: invoice.stripeSessionId || undefined,
      stripePaymentId: invoice.stripePaymentId || undefined,
    };
  }
}
