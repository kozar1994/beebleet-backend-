import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../libs/prisma/prisma.service';
import { DayjsService } from '../../libs/dayjs/dayjs.service';

@Injectable()
export class SubscriptionService {
  constructor(
    private prisma: PrismaService,
    private dayjs: DayjsService,
  ) {}

  async getActiveSubscription(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { activeSubscription: true },
    });

    return user?.activeSubscription || null;
  }

  async calculateRemainingAmount(subscription: any) {
    if (!subscription) return 0;

    const dailyRate = subscription.plan.pricePerMonth.toNumber() / 30;
    const now = this.dayjs.now();
    const start = this.dayjs.parse(subscription.currentPeriodStart);
    const daysUsed = now.diff(start, 'day');

    return dailyRate * daysUsed;
  }

  async calculatePlanChangeCredit(
    currentSubscriptionId: string,
    targetPlanId: string,
  ) {
    const currentSubscription = await this.prisma.subscription.findUnique({
      where: { id: currentSubscriptionId },
      include: { plan: true },
    });

    if (!currentSubscription) {
      throw new Error('Subscription not found');
    }

    const targetPlan = await this.prisma.plan.findUnique({
      where: { id: targetPlanId },
    });

    if (!targetPlan) {
      throw new Error('Target plan not found');
    }

    const currentDailyRate =
      currentSubscription.plan.pricePerMonth.toNumber() / 30;
    const targetDailyRate = targetPlan.pricePerMonth.toNumber() / 30;
    const now = this.dayjs.now();
    const start = this.dayjs.parse(currentSubscription.currentPeriodStart);
    const daysUsed = now.diff(start, 'day');

    return (currentDailyRate - targetDailyRate) * daysUsed;
  }
}
