import { User } from './user.entity';
import { Plan } from './plan.entity';
import { Invoice } from './invoice.entity';

export class Subscription {
  id: string;
  userId: string;
  planId: string;
  stripeSubscriptionId?: string;
  isActive: boolean;
  startDate: Date;
  endDate?: Date;
  user?: User;
  plan?: Plan;
  invoices?: Invoice[];
  createdAt: Date;
  updatedAt: Date;
}