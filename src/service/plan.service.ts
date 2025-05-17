import { Injectable, NotFoundException } from "@nestjs/common";
import { CreatePlanDto } from "src/dto/createPlan.dto";
import { PrismaService } from "src/prisma/prisma.service";
import Stripe from "stripe";


@Injectable()
export class PlanService{
    private stripe: Stripe ;
    
    constructor(private prisma: PrismaService){
        this.stripe = new Stripe(process.env.STRIPE_SECRET as string, { apiVersion: '2025-04-30.basil'})
    }

    async create(createPlanDto: CreatePlanDto){
        //Cria produto no Stripe
        const stripeProduct = await this.stripe.products.create({
            name: createPlanDto.name,
            description: createPlanDto.description,
        });

        console.log('Produto criado no Stripe:', stripeProduct); 
        //Cria o preço do produto
        const stripePrice = await this.stripe.prices.create({
            product: stripeProduct.id,
            unit_amount: Math.round(createPlanDto.price * 100),
            currency: 'eur',
            recurring: {
                interval: createPlanDto.billingCycle === 'yearly' ? 'year' : 'month'
            }
        });

        //Cria produto no banco de dados
        return this.prisma.plan.create({
            data: {
                ...createPlanDto,
                currency: 'EUR',
                stripePriceId: stripePrice.id,
                isActive: true
            }
        });
    }

    //Busca por todos os planos ativos
    async findAll(){
        return this.prisma.plan.findMany({
            where: {isActive:true}
        })
    }

    // Busca pelo plano por ID
    async findById(id:string){
        const plan = await this.prisma.plan.findUnique({
            where: {id}
        })

        if(!plan){
            throw new NotFoundException(`Plano com ID ${id} não encontrado`);
        }

        return plan;
    }

    //Remove plano 
    async remove(id:string){
        await this.findById(id);
        return this.prisma.plan.delete({ where: {id}});
    }

}