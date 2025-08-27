import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateInvoiceDto {
  @ApiProperty({ example: 19.99, required: false })
  @IsNumber()
  @IsOptional()
  total?: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  paid?: boolean;

  @ApiProperty({ example: 'pi_123456789', required: false })
  @IsString()
  @IsOptional()
  stripePaymentId?: string;
}
