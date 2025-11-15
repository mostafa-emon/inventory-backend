import { Body, Controller, Delete, Get, HttpException, Param, Patch, Post, Query } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CategoryDto } from "./dto/category.dto";
import { ValidateObjectIdPipe } from "src/common/validations/validate-object-id.pipe";
import { CategoryPaginationDto } from "./dto/category-pagination.dto";

@Controller('category')
export class CategoryController {
    constructor(
        private categorySerive: CategoryService
    ) {}

    @Post()
    createCategory(
        @Body() categoryDto: CategoryDto
    ) {
        return this.categorySerive.createCategory(categoryDto);
    }

    @Patch(':id')
    async updateCategory(
        @Param('id') id: ValidateObjectIdPipe,
        @Body() categoryDto: CategoryDto
    ) {
        const updatedCategory = await this.categorySerive.updateCategory(id, categoryDto);
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
        const deletedCompany = await this.categorySerive.deleteCategory(id);
        if(!deletedCompany) throw new HttpException('Category Not Found!', 400);
        return deletedCompany;
    }

    @Get()
    getCategoryByPagination(@Query() paginationDto: CategoryPaginationDto) {
        return this.categorySerive.getCategoryByPagination(paginationDto);
    }
}