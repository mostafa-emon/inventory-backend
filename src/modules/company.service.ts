import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { Model, Types } from "mongoose";
import { Company } from "src/schemas/company.schema";
import { ValidateObjectIdPipe } from "src/common/validations/validate-object-id.pipe";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import { UpdateCompanyByUserDto } from "./dto/update-company-user.dto";

@Injectable()
export class CompanyService {
    constructor(
        @InjectModel(Company.name) private companyModel: Model<Company>
    ) {}

    createCompany(createCompanyDto: CreateCompanyDto) {
        const newCompany = new this.companyModel(createCompanyDto);
        return newCompany.save();
    }

    async updateLogo(companyId: Types.ObjectId, fileURl: string) {
        const updatedCompany = await this.companyModel.findByIdAndUpdate(
            companyId,         
            { $set: { logo: fileURl } }, 
            { new: true }               
        );
        return updatedCompany;
    }

    getCompanyById(id: ValidateObjectIdPipe) {
        return this.companyModel.findById(id)
        .select('name status invocePhone invoiceAddress invoiceEmail invoiceWebsite logo')
    }

    async updateCompany(id: ValidateObjectIdPipe, updateData: UpdateCompanyDto) {
        const updatedCompany = await this.companyModel.findByIdAndUpdate(id, updateData, {new: true});
        return updatedCompany;
    }

    async updateCompanyByUser(id: ValidateObjectIdPipe, updateData: UpdateCompanyByUserDto) {
        const updatedCompany = await this.companyModel.findByIdAndUpdate(id, updateData, {new: true});
        return updatedCompany;
    }
}