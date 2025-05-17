import { User } from './user.entity';
import { Subscription } from './subscription.entity';

export class Invoice {
  id: string;
  userId: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  stripeInvoiceId: string;
  status: string;
  dueDate: Date;
  paidAt?: Date;
  user?: User;
  subscription?: Subscription;
  createdAt: Date;
  updatedAt: Date;
}