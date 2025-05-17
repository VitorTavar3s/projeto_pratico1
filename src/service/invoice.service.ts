import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import Stripe from "stripe";


@Injectable()
export class InvoiceService{
    private stripe: Stripe;

    constructor(){
         this.stripe = new Stripe(process.env.STRIPE_SECRET as string, { apiVersion: '2025-04-30.basil'})
    }

async sendInvoice(invoiceId: string) {
    // Buscar a fatura
    const invoice = await this.stripe.invoices.retrieve(invoiceId);

    if (!invoice) throw new NotFoundException('Fatura não encontrada');

    if (!invoice.customer_email) throw new NotFoundException('O cliente da fatura não possui e-mail cadastrado.');
    

    // Enviar o e-mail usando a própria Stripe
    const sentInvoice = await this.stripe.invoices.sendInvoice(invoiceId);

    return {
      message: 'Fatura enviada com sucesso!',
      invoiceUrl: sentInvoice.hosted_invoice_url,
      status: sentInvoice.status,
    };
  }

  async getInvoiceById(invoiceId: string){
    const invoice = await this.stripe.invoices.retrieve(invoiceId);

    if(!invoice) throw new NotFoundException('Fatura não encontrada');
    
    return{
        id: invoice.id,
        amount_due: invoice.amount_due,
        status: invoice.status,
        created: invoice.created,
        customer: invoice.customer_email,
        hosted_invoice_url: invoice.hosted_invoice_url,
    }

  }

  async getInvoicesByUser(userId: string) {
  // Buscar todos os clientes com esse userId no metadata
  const customers = await this.stripe.customers.list({
    limit: 100,
  });

  const matchedCustomer = customers.data.find((customer) =>
    customer.metadata?.userId === userId
  );

  if (!matchedCustomer) {
    throw new NotFoundException('Cliente não encontrado para este usuário.');
  }

  const invoices = await this.stripe.invoices.list({
    customer: matchedCustomer.id,
    limit: 100,
  });

  return invoices.data.map((invoice) => ({
    id: invoice.id,
    amount_due: invoice.amount_due,
    status: invoice.status,
    hosted_invoice_url: invoice.hosted_invoice_url,
    created: invoice.created,
  }));
  }

}