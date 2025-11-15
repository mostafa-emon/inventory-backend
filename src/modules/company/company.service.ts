import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Company } from "src/schemas/company.schema";
import { ValidateObjectIdPipe } from "src/common/validations/validate-object-id.pipe";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import { UpdateCompanyByUserDto } from "./dto/update-company-user.dto";

@Injectable()
export class CompanyService {
    constructor(
        @InjectModel(Company.name) private companyModel: Model<Company>
    ) {}

    async createCompany(createCompanyDto: CreateCompanyDto) {
        const isExists = await this.companyModel.findOne({ name: createCompanyDto.name});
        if(isExists) throw new HttpException('Company name already exists!', 400);

        const newCompany = await new this.companyModel(createCompanyDto);
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
            .select('name status invocePhone invoiceAddress invoiceEmail invoiceWebsite logo');
    }

    async updateCompany(id: ValidateObjectIdPipe, updateData: UpdateCompanyDto) {
        const isExists = await this.companyModel.findOne({ name: updateData.name, _id: {$ne: id}});
        if(isExists) throw new HttpException('Company name already exists!', 400);

        const updatedCompany = await this.companyModel.findByIdAndUpdate(id, updateData, {new: true});
        return updatedCompany;
    }

    async updateCompanyByUser(id: ValidateObjectIdPipe, updateData: UpdateCompanyByUserDto) {
        const updatedCompany = await this.companyModel.findByIdAndUpdate(id, updateData, {new: true});
        return updatedCompany;
    }

    deleteCompany(id: ValidateObjectIdPipe) {
        return this.companyModel.findByIdAndDelete(id);
    }
}