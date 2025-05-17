import { Module } from "@nestjs/common";
import { PaymentController } from "src/controller/payment.controller";
import { PrismaService } from "src/prisma/prisma.service";
import { PaymentService } from "src/service/payment.service";


@Module({
    controllers: [PaymentController],
    providers: [PaymentService,PrismaService]
})
export class PaymentModule{}