import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Company } from "src/schemas/company.schema";
import { ValidateObjectIdPipe } from "src/common/validations/validate-object-id.pipe";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import { UpdateCompanyByUserDto } from "./dto/update-company-user.dto";
import { CompanyPaginationDto } from "./dto/company-pagination.dto";

@Injectable()
export class CompanyService {
    constructor(
        @InjectModel(Company.name) private companyModel: Model<Company>
    ) {}

    async createCompany(createCompanyDto: CreateCompanyDto) {
        const isExists = await this.companyModel.findOne({ name: createCompanyDto.name});
        if(isExists) throw new HttpException('Company name already exists!', 400);

        return await new this.companyModel(createCompanyDto).save();
    }

    async updateLogo(companyId: Types.ObjectId, fileURl: string) {
        return await this.companyModel.findByIdAndUpdate(companyId, { $set: { logo: fileURl } }, { new: true });
    }

    async getCompanyById(id: ValidateObjectIdPipe) {
        return await this.companyModel.findById(id)
            .select('name status invocePhone invoiceAddress invoiceEmail invoiceWebsite logo');
    }

    async updateCompany(id: ValidateObjectIdPipe, updateData: UpdateCompanyDto) {
        const isExists = await this.companyModel.findOne({ name: updateData.name, _id: {$ne: id}});
        if(isExists) throw new HttpException('Company name already exists!', 400);

        return await this.companyModel.findByIdAndUpdate(id, updateData, {new: true});
    }

    async updateCompanyByUser(id: ValidateObjectIdPipe, updateData: UpdateCompanyByUserDto) {
        return await this.companyModel.findByIdAndUpdate(id, updateData, {new: true});
    }

    async deleteCompany(id: ValidateObjectIdPipe) {
        return await this.companyModel.findByIdAndDelete(id);
    }

    async getCompanyByPagination(paginationDto: CompanyPaginationDto) {
        const filter: any = {};
        const page = paginationDto.page;
        const limit = paginationDto.limit;

        if(paginationDto.name) filter.name = { $regex: paginationDto.name, $options: 'i'};
        if(paginationDto.status !== undefined) filter.status = paginationDto.status;

        const skip = (page - 1) * limit

        const [data, total] = await Promise.all([
            this.companyModel.find(filter).skip(skip).limit(limit).exec(),
            this.companyModel.countDocuments(filter)
        ]);

        return {
            items: data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / paginationDto.limit)
        }
    }
}