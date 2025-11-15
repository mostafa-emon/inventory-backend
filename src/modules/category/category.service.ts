import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Category } from "src/schemas/category.schema";
import { CategoryDto } from "./dto/category.dto";
import { ValidateObjectIdPipe } from "src/common/validations/validate-object-id.pipe";
import { CategoryPaginationDto } from "./dto/category-pagination.dto";
import { CategoryFilterDto } from "./dto/category-list.dto";

@Injectable()
export class CategoryService {
    constructor(
        @InjectModel(Category.name) private categoryModel: Model<Category>
    ) {}
    
    async createCategory(categoryDto: CategoryDto) {
        const isExists = await this.categoryModel.findOne({ name: categoryDto.name, companyId: categoryDto.companyId});
        if(isExists) throw new HttpException('Category name already exists!', 400);

        return await new this.categoryModel(categoryDto).save();
    }

    async updateCategory(id: ValidateObjectIdPipe, categoryDto: CategoryDto) {
        const isExists = await this.categoryModel.findOne({ name: categoryDto.name, companyId: categoryDto.companyId, _id: {$ne: id}});
        if(isExists) throw new HttpException('Category name already exists!', 400);

        return await this.categoryModel.findByIdAndUpdate(id, categoryDto, {new: true});
    }

    async deleteCategory(id: ValidateObjectIdPipe) {
        return await this.categoryModel.findByIdAndDelete(id);
    }

    async getCategoryByPagination(paginationDto: CategoryPaginationDto) {
        const filter: any = {};
        const page = paginationDto.page;
        const limit = paginationDto.limit;

        filter.companyId = paginationDto.companyId;
        if(paginationDto.name) filter.name = { $regex: paginationDto.name, $options: 'i'};

        const skip = (page - 1) * limit

        const [data, total] = await Promise.all([
            this.categoryModel.find(filter).skip(skip).limit(limit).exec(),
            this.categoryModel.countDocuments(filter)
        ]);

        return {
            items: data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / paginationDto.limit)
        }
    }

    async getCategoryByFilter(filterDto: CategoryFilterDto) {
        const filter: any = {};
        filter.companyId = filterDto.companyId;
        if(filterDto.name) filter.name = { $regex: filterDto.name, $options: 'i'};

        return await this.categoryModel.find(filter).select('name');
    }
}