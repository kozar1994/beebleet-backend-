import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../libs/prisma/prisma.service';

@Injectable()
export class PaymentService {
  constructor(readonly prisma: PrismaService) {}

  async createStripeSession(invoiceId: string, amount: number): Promise<any> {
    const stripeSessionId = `mock_sess_${Math.random().toString(36).substring(2, 15)}`;

    return {
      id: stripeSessionId,
      checkoutUrl: `https://checkout.stripe.com/mock_session/${stripeSessionId}`,
      invoiceId,
      amount,
      currency: 'usd',
      status: 'open',
    };
  }

  async mockPaymentWebhook(stripeSessionId: string): Promise<any> {
    const invoice = await this.prisma.invoice.findUnique({
      where: { stripeSessionId },
    });

    if (!invoice) {
      throw new Error('Invoice not found');
    }

    return {
      id: stripeSessionId,
      status: 'paid',
      payment_intent: `mock_pi_${Math.random().toString(36).substring(2, 15)}`,
      amount: invoice.paid ? 0 : invoice.total.mul(100).toFixed(2), // в центах
      currency: 'usd',
      invoice: `mock_in_${Math.random().toString(36).substring(2, 15)}`,
    };
  }
}
