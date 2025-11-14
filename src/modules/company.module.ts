import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Company, CompanySchema } from "src/schemas/company.schema";
import { CompanyController } from "./company.controller";
import { CompanyService } from "./company.service";
import { FileUploadService } from "src/common/services/file-upload.service";

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
        FileUploadService
    ]
})

export class CompanyModule {}