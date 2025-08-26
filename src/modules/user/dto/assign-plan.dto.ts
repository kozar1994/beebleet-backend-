import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class AssignPlanDto {
  @ApiProperty({ example: 1, description: 'ID of the plan to assign' })
  @IsInt()
  planId: number;
}
