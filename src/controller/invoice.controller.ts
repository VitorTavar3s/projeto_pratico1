import { Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { InvoiceService } from "src/service/invoice.service";


@Controller('invoices')
//@UseGuards(JwtAuthGuard)
export class InvoiceController{
    constructor(private readonly invoiceService: InvoiceService){}

    @Post('send/:id')
    @HttpCode(HttpStatus.OK)
    async sendInvoice(@Param('id') id: string){
        return this.invoiceService.sendInvoice(id);
    }

    @Get(':id')
    async getInvoice(@Param('id') id: string) {
    return this.invoiceService.getInvoiceById(id);
  }

    @Get('user/:userId')
    async getInvoicesByUser(@Param('userId') userId: string) {
    return this.invoiceService.getInvoicesByUser(userId);
  }
}