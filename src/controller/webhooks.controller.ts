import {
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import Stripe from 'stripe';
import { Request, Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('webhooks')
export class WebhooksController {
  private stripe = new Stripe(process.env.STRIPE_SECRET as string, {
    apiVersion: '2025-04-30.basil',
  });

  constructor(private readonly prisma: PrismaService) {}

  @Post('stripe')
  @HttpCode(HttpStatus.OK)
  async handleStripeWebhook(
    @Req() request: Request,
    @Res() response: Response,
    @Headers('stripe-signature') sig: string,
  ) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event: Stripe.Event;

    console.log('📥 Recebido webhook:', request.body, sig);


    try {
      const rawBody = (request as any).rawBody;
      event = this.stripe.webhooks.constructEvent(rawBody, sig, endpointSecret!);
    } catch (err) {
      console.error('❌ Erro na verificação da assinatura:', err.message);
      return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'invoice.created': {
        const invoice = event.data.object as Stripe.Invoice;
        const userId = invoice.metadata?.userId;
        const subscriptionId = invoice.metadata?.subscriptionId;

        if (!userId || !subscriptionId) {
          console.warn('⚠️ Fatura criada sem userId ou subscriptionId no metadata');
          break;
        }

        await this.prisma.invoice.create({
          data: {
            userId,
            subscriptionId,
            amount: invoice.amount_due / 100,
            currency: invoice.currency,
            stripeInvoiceId: invoice.id as string,
            status: invoice.status as string,
            dueDate: new Date((invoice.due_date ?? invoice.created) * 1000),
            paidAt: invoice.status === 'paid' ? new Date() : null,
          },
        });

        console.log('🧾 Fatura salva no banco:', invoice.id);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;

        await this.prisma.invoice.updateMany({
          where: { stripeInvoiceId: invoice.id },
          data: {
            status: 'paid',
            paidAt: new Date(),
          },
        });

        console.log('✅ Fatura marcada como paga:', invoice.id);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;

        await this.prisma.invoice.updateMany({
          where: { stripeInvoiceId: invoice.id },
          data: {
            status: 'failed',
          },
        });

        console.log('🚫 Pagamento da fatura falhou:', invoice.id);
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('💰 Pagamento bem-sucedido:', paymentIntent.id);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('❌ Pagamento falhou:', paymentIntent.id);
        break;
      }

      default:
        console.log(`📦 Evento não tratado: ${event.type}`);
    }

    return response.json({ received: true });
  }
}
