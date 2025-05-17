import { Injectable } from "@nestjs/common";
import { CreatePaymentDto } from "src/dto/createPayment.dto";
import Stripe from "stripe";


@Injectable()
export class PaymentService{
    private stripe : Stripe;
    
  constructor(){
        this.stripe = new Stripe(process.env.STRIPE_SECRET as string, { apiVersion: '2025-04-30.basil'})
    }

    async createPayment(createDto : CreatePaymentDto){
        const {userId,amount,currency} = createDto;

        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: amount *100,
            currency: currency,
            automatic_payment_methods: {enabled: true},
            metadata: { userId: userId}
        })
        
        return {clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id};
    }

    async getPaymentStatus(paymentIntentId: string){
        const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);

        return{
            id: paymentIntent.id,
            status: paymentIntent.status,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            created: paymentIntent.created
        }
    }

    
}
