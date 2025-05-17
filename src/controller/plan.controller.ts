import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from "@nestjs/common";
import { CreatePlanDto } from "src/dto/createPlan.dto";
import { AdminGuard } from "src/guards/admin-guard";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { PlanService } from "src/service/plan.service";

//"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjZDQwZTYxNC0zMmNmLTRmODQtYWEzNi0zZTI0YzgxZGJhZGIiLCJlbWFpbCI6ImFkbWluQHNpc3RlbWEuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQ3MjQzMDUwLCJleHAiOjE3NDczMjk0NTB9.PvOuvdpUCRgJO4y7zoDkCF3MzABKplSloKtMCSu7ObE"
@Controller('plans')
@UseGuards(JwtAuthGuard)
export class PlanController{
    constructor(private planService : PlanService){}

    @Post()
    @UseGuards(AdminGuard)
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createPlanDto: CreatePlanDto){
        return this.planService.create(createPlanDto);
    }

    @Get()
    async findAll(){
        return this.planService.findAll();
    }

    @Get(':id')
    async findById(@Param('id') id: string){
        return this.planService.findById(id);
    }

    @Delete(':id')
    async remove(@Param('id') id: string){
        return this.planService.remove(id);
    }

}