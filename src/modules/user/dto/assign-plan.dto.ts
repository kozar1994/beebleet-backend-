import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AssignPlanDto {
  @ApiProperty({
    example: 'clx123abc456def789ghi012',
    description: 'ID of the plan to assign',
  })
  @IsString()
  planId: string;
}
