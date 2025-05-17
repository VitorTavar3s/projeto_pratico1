import { Subscription } from './subscription.entity';

export class Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  stripePriceId?: string;
  billingCycle: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  subscriptions?: Subscription[];
}