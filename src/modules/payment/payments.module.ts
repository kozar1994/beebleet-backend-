import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Module({
  providers: [PaymentService],
  controllers: [],
  exports: [PaymentService],
})
export class PaymentsModule {}
