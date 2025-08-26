import { ApiProperty } from '@nestjs/swagger';

export class PlanResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'pro-plan' })
  slug: string;

  @ApiProperty({ example: 'Pro Plan' })
  name: string;

  @ApiProperty({ example: 19.99 })
  pricePerMonth: number;

  @ApiProperty({ example: 1000 })
  qrLimit: number;

  @ApiProperty({ example: 'Professional plan description', nullable: true })
  description: string | null;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-02T00:00:00.000Z' })
  updatedAt: Date;
}
