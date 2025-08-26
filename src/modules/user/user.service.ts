import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/libs/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { AssignPlanDto } from './dto/assign-plan.dto';
import { SubscriptionResponseDto } from './dto/subscription-response.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async findAll(): Promise<UserResponseDto[]> {
    return this.prisma.user.findMany();
  }

  async assignPlan(
    userId: string,
    assignPlanDto: AssignPlanDto,
  ): Promise<SubscriptionResponseDto> {
    const now = new Date();
    const nextMonth = new Date(now);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const subscription = await this.prisma.subscription.create({
      data: {
        user: { connect: { id: userId } },
        plan: { connect: { id: assignPlanDto.planId } },
        status: 'ACTIVE',
        startDate: now,
        currentPeriodStart: now,
        currentPeriodEnd: nextMonth,
        quantity: 1,
        autoRenew: true,
      },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        activeSubscriptionId: subscription.id,
      },
    });

    return {
      id: subscription.id,
      planId: subscription.planId,
      status: subscription.status,
      startDate: subscription.startDate,
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
      quantity: subscription.quantity,
      autoRenew: subscription.autoRenew,
      createdAt: subscription.createdAt,
      updatedAt: subscription.updatedAt,
    };
  }
}
