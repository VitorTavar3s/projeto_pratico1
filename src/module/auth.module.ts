import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from 'src/controller/auth.controller';
import { AuthService } from '../service/auth.service';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { PrismaService } from 'src/prisma/prisma.service';
import { JWT_CONFIG } from 'src/shared/constants';
import { PassportModule } from '@nestjs/passport';
import { PlanModule } from './plan.module';
import { SubscriptionModule } from './subscription.module';
import { PaymentModule } from './payment.module';
import { InvoiceModule } from './invoice.module';
import { WebhookModule } from './webhook.module';


@Module({
  imports: [
    WebhookModule,
    InvoiceModule,
    PaymentModule,
    SubscriptionModule,
    PlanModule,
    PassportModule,
    JwtModule.register({
      secret: JWT_CONFIG.secret,
      signOptions: {expiresIn: JWT_CONFIG.expiresIn}
    })
  ],
  controllers: [AuthController],
  providers: [AuthService,PrismaService,JwtStrategy],
})
export class AuthModule {}
