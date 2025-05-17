import { Module } from "@nestjs/common";
import { InvoiceController } from "src/controller/invoice.controller";
import { InvoiceService } from "src/service/invoice.service";


@Module({
    controllers: [InvoiceController],
    providers: [InvoiceService]
})
export class InvoiceModule{}