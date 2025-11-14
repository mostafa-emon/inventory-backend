import { Body, Controller, HttpException, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { CompanyService } from "./company.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { FileUploadService } from "src/common/services/file-upload.service";

@Controller('company')
export class CompanyController {
    constructor(
        private companyService: CompanyService,
        private fileUploadService: FileUploadService
    ) {}

    @UseInterceptors(FileInterceptor('logo'))
    @Post()
    async createCompany(
        @Body() createCompanyDto: CreateCompanyDto,
        @UploadedFile() logo
    ) {
        if(logo) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            const maxSize = 1 * 1024 * 1024; // 1MB

            if (!allowedTypes.includes(logo.mimetype)) {
                throw new HttpException('Only JPG or PNG files are allowed!', 400);
            }

            if (logo.size > maxSize) {
                throw new HttpException('File size should not exceed 1MB!', 400);
            }

            const company = await this.companyService.createCompany(createCompanyDto);
            
            const key = `inventory/company-logo/${company._id}`;
            const fileUrl = await this.fileUploadService.uploadFile(logo, key);
            return this.companyService.updateLogo(company._id, fileUrl);
        } else {
            throw new HttpException('Company logo is required!', 400);
        }
    }
}