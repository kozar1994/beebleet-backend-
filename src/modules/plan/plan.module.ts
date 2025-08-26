import { Module } from '@nestjs/common';
import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';
import { PrismaModule } from 'src/libs/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PlanController],
  providers: [PlanService],
})
export class PlanModule {}
