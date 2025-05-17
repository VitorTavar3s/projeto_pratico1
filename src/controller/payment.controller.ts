import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from "@nestjs/common";
import { CreatePaymentDto } from "src/dto/createPayment.dto";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { PaymentService } from "src/service/payment.service";



@Controller('payments')
//@UseGuards(JwtAuthGuard)
export class PaymentController{
    constructor(private readonly paymentService: PaymentService){}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createPayment(@Body() createDto: CreatePaymentDto) {
    return this.paymentService.createPayment(createDto);
  }

  @Get(':id')
  async getPaymentStatus(@Param('id') id:string){
    return this.paymentService.getPaymentStatus(id);
  }
}