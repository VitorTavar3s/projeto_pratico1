import { Subscription } from "./subscription.entity";

export class User{
    id: string;
    email: string;
    password: string;
    StripeCostumerId?: string;
    createdAt: Date;
    updateAt: Date;
    subscriptions? : Subscription[];
    role: 'user' | 'admin';
}