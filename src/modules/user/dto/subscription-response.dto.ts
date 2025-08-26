import { ApiProperty } from '@nestjs/swagger';

export class SubscriptionResponseDto {
  @ApiProperty({ example: 'clx123abc456def789ghi012' })
  id: string;

  @ApiProperty({ example: 1 })
  planId: number;

  @ApiProperty({ example: 'ACTIVE' })
  status: string;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  startDate: Date;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  currentPeriodStart: Date;

  @ApiProperty({ example: '2025-02-01T00:00:00.000Z' })
  currentPeriodEnd: Date;

  @ApiProperty({ example: 1 })
  quantity: number;

  @ApiProperty({ example: true })
  autoRenew: boolean;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  updatedAt: Date;
}
