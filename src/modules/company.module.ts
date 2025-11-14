import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Company, CompanySchema } from "src/schemas/company.schema";
import { CompanyController } from "./company.controller";
import { CompanyService } from "./company.service";
import { FileHandlingService } from "src/common/services/file-handling.service";

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Company.name,
            schema: CompanySchema
        }])
    ],
    controllers: [
        CompanyController
    ],
    providers: [
        CompanyService,
        FileHandlingService
    ]
})

export class CompanyModule {}