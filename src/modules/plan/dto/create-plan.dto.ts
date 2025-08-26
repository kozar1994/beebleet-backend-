import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePlanDto {
  @ApiProperty({ example: 'pro-plan' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'Pro Plan' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 19.99 })
  @IsNumber()
  pricePerMonth: number;

  @ApiProperty({ example: 1000 })
  @IsInt()
  qrLimit: number;

  @ApiProperty({ example: 'Professional plan description', required: false })
  @IsString()
  description?: string;
}
