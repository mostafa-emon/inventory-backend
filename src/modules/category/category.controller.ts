import { Body, Controller, Delete, Get, HttpException, Param, Patch, Post, Query } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { ValidateObjectIdPipe } from "src/common/validations/validate-object-id.pipe";
import { CategoryPaginationDto } from "./dto/category-pagination.dto";
import { CategoryFilterDto } from "./dto/category-filter.dto";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Controller('category')
export class CategoryController {
    constructor(
        private categorySerive: CategoryService
    ) {}

    @Post()
    createCategory(
        @Body() createCategoryDto: CreateCategoryDto
    ) {
        return this.categorySerive.createCategory(createCategoryDto);
    }

    @Patch(':id')
    async updateCategory(
        @Param('id') id: ValidateObjectIdPipe,
        @Body() updateCategoryDto: UpdateCategoryDto
    ) {
        const updatedCategory = await this.categorySerive.updateCategory(id, updateCategoryDto);
        if(!updatedCategory) throw new HttpException('Category not found!', 400);
        return updatedCategory;
    }

    @Delete(':id')
    async deleteCategory(
        @Param('id') id: ValidateObjectIdPipe
    ) {
         /*
            All Other Delete Actions will be placed here!
        */
        const deletedCategory = await this.categorySerive.deleteCategory(id);
        if(!deletedCategory) throw new HttpException('Category Not Found!', 400);
        return deletedCategory;
    }

    @Get()
    getCategoryByPagination(@Query() paginationDto: CategoryPaginationDto) {
        return this.categorySerive.getCategoryByPagination(paginationDto);
    }

    @Get('by-filter')
    getCategoryByFilter(@Query() filterDto: CategoryFilterDto) {
        return this.categorySerive.getCategoryByFilter(filterDto);
    }

    @Get(':id')
    getCategoryById(
        @Param('id') id: ValidateObjectIdPipe
    ) {
        return this.categorySerive.getCategoryById(id);
    }

}