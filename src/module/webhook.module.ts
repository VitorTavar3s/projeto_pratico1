import { Controller, Module } from "@nestjs/common";
import { WebhooksController } from "src/controller/webhooks.controller";
import { PrismaService } from "src/prisma/prisma.service";
import { StripeWebhookService } from "src/service/stripe-webhook.service";


@Module({
    controllers: [WebhooksController],
    providers: [StripeWebhookService,PrismaService]
})
export class WebhookModule{}