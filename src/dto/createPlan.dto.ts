import { IsIn, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreatePlanDto {
  @IsString()
  name: string;

  //@IsString()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsIn(['monthly','yearly'])
  billingCycle: string;
}