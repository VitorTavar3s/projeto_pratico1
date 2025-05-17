import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export class CreatePaymentDto{
    
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  currency: string;
}