import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Category } from "src/schemas/category.schema";
import { CategoryDto } from "./dto/category.dto";
import { ValidateObjectIdPipe } from "src/common/validations/validate-object-id.pipe";

@Injectable()
export class CategoryService {
    constructor(
        @InjectModel(Category.name) private categoryModel: Model<Category>
    ) {}
    
    async createCategory(categoryDto: CategoryDto) {
        const isExists = await this.categoryModel.findOne({ name: categoryDto.name});
        if(isExists) throw new HttpException('Category name already exists!', 400);

        return await new this.categoryModel(categoryDto).save();
    }

    async updateCategory(id: ValidateObjectIdPipe, categoryDto: CategoryDto) {
        const isExists = await this.categoryModel.findOne({ name: categoryDto.name, _id: {$ne: id}});
        if(isExists) throw new HttpException('Category name already exists!', 400);

        return await this.categoryModel.findByIdAndUpdate(id, categoryDto, {new: true});
    }

    async deleteCategory(id: ValidateObjectIdPipe) {
        return await this.categoryModel.findByIdAndDelete(id);
    }
}