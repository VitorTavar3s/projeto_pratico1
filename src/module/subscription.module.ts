import { Module } from "@nestjs/common";
import { SubscriptionController } from "src/controller/subscription.controller";
import { PrismaService } from "src/prisma/prisma.service";
import { SubscriptionService } from "src/service/subscription.service";


@Module({
    controllers: [SubscriptionController],
    providers: [SubscriptionService,PrismaService]
})
export class SubscriptionModule{}