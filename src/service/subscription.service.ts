import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateSubscriptionDto } from "src/dto/createSubscription.dto";
import { PrismaService } from "src/prisma/prisma.service";
import Stripe from "stripe";


@Injectable()
export class SubscriptionService{
    private stripe: Stripe;

    constructor(private prisma: PrismaService){
        this.stripe = new Stripe(process.env.STRIPE_SECRET as string, { apiVersion: '2025-04-30.basil'})
    }

    async create(dto: CreateSubscriptionDto) {

    const plan = await this.prisma.plan.findUnique({ where: { id: dto.planId } });
    if (!plan) throw new NotFoundException('Plano não encontrado');

    const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    if (!plan.stripePriceId) throw new Error('ID do preço Stripe não configurado no plano');

    // 1. Cria o cliente Stripe
    const customer = await this.stripe.customers.create({
        email: user.email,
    });

    // 2. Cria a assinatura local no banco
    const subscription = await this.prisma.subscription.create({
        data: {
        userId: dto.userId,
        planId: dto.planId,
        stripeSubscriptionId: '', 
        isActive: true,
        },
    });

    // 3. Cria a assinatura no Stripe com metadata
    const stripeSub = await this.stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: plan.stripePriceId }],
        payment_behavior: 'default_incomplete',
        metadata: {
        userId: user.id,
        subscriptionId: subscription.id,
        },
    });

    // 4. Atualiza o registro da assinatura no banco
    await this.prisma.subscription.update({
        where: { id: subscription.id },
        data: { stripeSubscriptionId: stripeSub.id },
    });

    // 5. Retorna a assinatura atualizada
    return {
        ...subscription,
        stripeSubscriptionId: stripeSub.id,
    };
    }

    async findById(id: string){
        const sub = await this.prisma.subscription.findUnique({
            where: {id},
            include: {
                plan: true,
                user: true
            }
        })

        if(!sub) throw new NotFoundException('Assinatura não encontrada!');
        return sub;
    }

    async cancel(id: string){
        const sub = await this.prisma.subscription.findUnique({where: {id}});

        if(!sub) throw new NotFoundException('Assinatura não encontrada!');
        if(!sub.stripeSubscriptionId) throw new Error(undefined);

        await this.stripe.subscriptions.cancel(sub.stripeSubscriptionId);

        return this.prisma.subscription.update({
            where: {id},
            data: {isActive: false}
        })
    }

}