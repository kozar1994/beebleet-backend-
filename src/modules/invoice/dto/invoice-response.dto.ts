import { ApiProperty } from '@nestjs/swagger';

export class InvoiceResponseDto {
  @ApiProperty({ example: 'clx123abc456def789ghi012' })
  id: string;

  @ApiProperty({ example: 'clx123abc456def789ghi012' })
  subscriptionId: string;

  @ApiProperty({ example: 19.99 })
  total: number;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  issuedAt: Date;

  @ApiProperty({ example: '2025-02-01T00:00:00.000Z', nullable: true })
  dueDate?: Date;

  @ApiProperty({ example: false })
  paid: boolean;

  @ApiProperty({ example: 'sess_123456789', nullable: true })
  stripeSessionId?: string;

  @ApiProperty({ example: 'pi_123456789', nullable: true })
  stripePaymentId?: string;

  @ApiProperty({
    example: 'https://checkout.stripe.com/mock_session/',
    nullable: true,
  })
  checkoutUrl?: string;
}
