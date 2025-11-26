import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Category } from "src/schemas/category.schema";
import { CategoryDto } from "./dto/category.dto";
import { ValidateObjectIdPipe } from "src/common/validations/validate-object-id.pipe";
import { CategoryPaginationDto } from "./dto/category-pagination.dto";
import { CategoryFilterDto } from "./dto/category-filter.dto";

@Injectable()
export class CategoryService {
    constructor(
        @InjectModel(Category.name) private categoryModel: Model<Category>
    ) {}
    
    async createCategory(categoryDto: CategoryDto) {
        return await new this.categoryModel(categoryDto).save();
    }

    async updateCategory(id: ValidateObjectIdPipe, categoryDto: CategoryDto) {
        return await this.categoryModel.findByIdAndUpdate(id, categoryDto, {new: true});
    }

    async deleteCategory(id: ValidateObjectIdPipe) {
        return await this.categoryModel.findByIdAndDelete(id);
    }

    async getCategoryById(id: ValidateObjectIdPipe) {
        return await this.categoryModel.findById(id)
            .select('name');
    }

    async getCategoryByPagination(paginationDto: CategoryPaginationDto) {
        const filter: any = {};
        const page = paginationDto.page;
        const limit = paginationDto.limit;

        filter.company = paginationDto.company;
        if(paginationDto.name) filter.name = { $regex: `^${paginationDto.name}` };

        const skip = (page - 1) * limit

        const [data, total] = await Promise.all([
            this.categoryModel.find(filter).skip(skip).limit(limit).select('name').exec(),
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
        filter.company = filterDto.company;
        if(filterDto.name) filter.name = { $regex: `^${filterDto.name}` };

        return await this.categoryModel.find(filter).select('name');

        /*
        const explain: any = await this.categoryModel.find(filter).select('name -_id').explain('executionStats');
        const data = await this.categoryModel.find(filter).select('name -_id');
        const { totalKeysExamined, totalDocsExamined } = explain.executionStats;
        return {
            metrics: { totalKeysExamined, totalDocsExamined },
            data
        };
        */
    }
}