import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeWebhookService {
  private readonly logger = new Logger(StripeWebhookService.name);

  async handleStripeEvent(event: Stripe.Event): Promise<void> {
    // Verifica se o evento já foi processado (idempotência)
    if (await this.isEventProcessed(event.id)) {
      this.logger.log(`Event ${event.id} already processed`);
      return;
    }

    // Trata diferentes tipos de eventos
    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentIntentSucceeded(event);
        break;
        
      case 'payment_intent.payment_failed':
        await this.handlePaymentIntentFailed(event);
        break;
        
      case 'invoice.payment_succeeded':
        await this.handleInvoicePaymentSucceeded(event);
        break;
        
      case 'invoice.payment_failed':
        await this.handleInvoicePaymentFailed(event);
        break;
        
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await this.handleSubscriptionEvent(event);
        break;

      default:
        this.logger.warn(`Unhandled event type: ${event.type}`);
    }

    // Marca o evento como processado
    await this.markEventAsProcessed(event.id);
  }

  private async handlePaymentIntentSucceeded(event: Stripe.Event): Promise<void> {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    this.logger.log(`Payment succeeded: ${paymentIntent.id}`);
    
    // Implemente sua lógica de negócio aqui
    // Ex: Atualizar pedido no banco de dados, enviar e-mail, etc.
  }

  private async handlePaymentIntentFailed(event: Stripe.Event): Promise<void> {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    this.logger.log(`Payment failed: ${paymentIntent.id}`);
    
    // Implemente sua lógica de negócio aqui
    // Ex: Notificar o usuário sobre o pagamento falho
  }

  private async handleInvoicePaymentSucceeded(event: Stripe.Event): Promise<void> {
    const invoice = event.data.object as Stripe.Invoice;
    this.logger.log(`Invoice payment succeeded: ${invoice.id}`);
    
    // Implemente sua lógica de assinaturas aqui
  }

  private async handleInvoicePaymentFailed(event: Stripe.Event): Promise<void> {
    const invoice = event.data.object as Stripe.Invoice;
    this.logger.log(`Invoice payment failed: ${invoice.id}`);
    
    // Implemente sua lógica de tratamento de falhas aqui
  }

  private async handleSubscriptionEvent(event: Stripe.Event): Promise<void> {
    const subscription = event.data.object as Stripe.Subscription;
    this.logger.log(`Subscription event: ${event.type} - ${subscription.id}`);
    
    // Implemente sua lógica de atualização de assinatura aqui
  }

  private async isEventProcessed(eventId: string): Promise<boolean> {
    // Implemente sua verificação de idempotência aqui
    // Ex: Verificar no banco de dados se o evento já foi processado
    return false;
  }

  private async markEventAsProcessed(eventId: string): Promise<void> {
    // Implemente sua lógica para marcar o evento como processado
    // Ex: Salvar no banco de dados
  }
}