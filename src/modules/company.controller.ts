import { Body, Controller, FileTypeValidator, HttpException, MaxFileSizeValidator, Param, ParseFilePipe, Patch, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { CompanyService } from "./company.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { ValidateObjectIdPipe } from "src/common/validations/validate-object-id.pipe";
import { FileHandlingService } from "src/common/services/file-handling.service";
import { UpdateCompanyDto } from "./dto/update-company.dto";

@Controller('company')
export class CompanyController {
    constructor(
        private companyService: CompanyService,
        private fileHandlingService: FileHandlingService
    ) {}

    @UseInterceptors(FileInterceptor('logo'))
    @Post()
    async createCompany(
        @Body() createCompanyDto: CreateCompanyDto,
        @UploadedFile() logo: Express.Multer.File
    ) {
        const company = await this.companyService.createCompany(createCompanyDto);
            
        const key = `inventory/company-logo/${company._id}`;
        const fileUrl = await this.fileHandlingService.uploadFile(logo, key);
        return this.companyService.updateLogo(company._id, fileUrl);
    }

    @UseInterceptors(FileInterceptor('logo'))
    @Patch(':id')
    async updateCompany(
        @Param('id') id: ValidateObjectIdPipe,
        @Body() updateCompanyDto: UpdateCompanyDto,
        @UploadedFile(
            new ParseFilePipe({
            validators: [
                new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
                new MaxFileSizeValidator({ maxSize: 1 * 1024 * 1024 }),
            ],
            fileIsRequired: false,
            exceptionFactory: (errors) => new HttpException('Logo must be PNG/JPG/JPEG under 1MB', 400),
      }),
        ) logo?: Express.Multer.File
    ) {
        const findCompany = await this.companyService.getCompanyById(id);
        if(!findCompany) throw new HttpException('Company not Found!', 400);

        if(logo) {
            if(findCompany.logo && findCompany.logo != '') this.fileHandlingService.deleteFile(findCompany.logo);
            
            const key = `inventory/company-logo/${id.toString()}`;
            const fileUrl = await this.fileHandlingService.uploadFile(logo, key);
            const updateData = {...updateCompanyDto, logo: fileUrl}
            return this.companyService.updateCompany(id, updateData);
        } else {
            if(findCompany.logo && findCompany.logo != '') {
                const updateData = {...updateCompanyDto, logo: findCompany.logo}
                const updatedCompany = this.companyService.updateCompany(id, updateData);
                return updatedCompany;
            } else {
                const updatedCompany = this.companyService.updateCompany(id, updateCompanyDto);
                return updatedCompany;
            }
        }   
    }
}