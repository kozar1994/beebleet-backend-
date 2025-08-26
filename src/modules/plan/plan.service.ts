import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/libs/prisma/prisma.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PlanResponseDto } from './dto/plan-response.dto';

@Injectable()
export class PlanService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPlanDto: CreatePlanDto): Promise<PlanResponseDto> {
    const plan = await this.prisma.plan.create({
      data: createPlanDto,
    });
    return this.mapToDto(plan);
  }

  async update(
    id: string,
    updatePlanDto: UpdatePlanDto,
  ): Promise<PlanResponseDto> {
    const plan = await this.prisma.plan.update({
      where: { id },
      data: updatePlanDto,
    });
    return this.mapToDto(plan);
  }

  async remove(id: string): Promise<PlanResponseDto> {
    const plan = await this.prisma.plan.delete({
      where: { id },
    });
    return this.mapToDto(plan);
  }

  async findAll(): Promise<PlanResponseDto[]> {
    const plans = await this.prisma.plan.findMany();
    return plans.map((plan) => this.mapToDto(plan));
  }

  private mapToDto(plan: any): PlanResponseDto {
    return {
      id: plan.id,
      slug: plan.slug,
      name: plan.name,
      pricePerMonth: plan.pricePerMonth.toNumber(), // Convert Decimal to number
      qrLimit: plan.qrLimit,
      description: plan.description,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
    };
  }
}
