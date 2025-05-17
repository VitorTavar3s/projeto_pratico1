import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, UseGuards } from "@nestjs/common";
import { CreateSubscriptionDto } from "src/dto/createSubscription.dto";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { SubscriptionService } from "src/service/subscription.service";



@Controller('subscription')
@UseGuards(JwtAuthGuard)
export class SubscriptionController{
    constructor(private subscriptionService: SubscriptionService){}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createDto: CreateSubscriptionDto){
        return this.subscriptionService.create(createDto);
    }

    @Get(':id')
    async findById(@Param('id') id: string){
        return this.subscriptionService.findById(id);
    }

    @Delete(':id')
    async cancel(@Param('id') id: string){
        return this.subscriptionService.cancel(id);
    }

}