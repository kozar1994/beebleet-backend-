import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateInvoiceDto {
  @ApiProperty({ example: 'clx123abc456def789ghi012' })
  @IsString()
  planId: string;

  // ID тут не буде буде братись с сесії або токена, але так зараз так
  @ApiProperty({ example: 'clx123abc456def789ghi012' })
  @IsString()
  userId: string;
}
