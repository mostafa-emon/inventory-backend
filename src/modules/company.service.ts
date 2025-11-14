import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { Model, Types } from "mongoose";
import { Company } from "src/schemas/company.schema";

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
}