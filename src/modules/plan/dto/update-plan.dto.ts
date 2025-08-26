import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdatePlanDto {
  @ApiProperty({ example: 'updated-pro-plan', required: false })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({ example: 'Updated Pro Plan', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 29.99, required: false })
  @IsNumber()
  @IsOptional()
  pricePerMonth?: number;

  @ApiProperty({ example: 2000, required: false })
  @IsInt()
  @IsOptional()
  qrLimit?: number;

  @ApiProperty({ example: 'Updated description', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
