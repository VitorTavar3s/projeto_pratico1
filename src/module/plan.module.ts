import { Module } from "@nestjs/common";
import { PlanController } from "src/controller/plan.controller";
import { PrismaService } from "src/prisma/prisma.service";
import { PlanService } from "src/service/plan.service";

@Module({
    controllers: [PlanController],
    providers: [PlanService,PrismaService]
})
export class PlanModule{}