import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './libs/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { PlanModule } from './modules/plan/plan.module';
import { InvoiceService } from './modules/invoice/invoice.service';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { PaymentModule } from './modules/payment/payment.module';
import { DayjsModule } from './libs/dayjs';

@Module({
  imports: [
    PrismaModule,
    DayjsModule,
    UserModule,
    PlanModule,
    InvoiceModule,
    SubscriptionModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService, InvoiceService],
})
export class AppModule {}
