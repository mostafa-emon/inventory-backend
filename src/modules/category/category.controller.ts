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
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categorySerive.create(createCategoryDto);
    }

    @Get()
    findAllPagination(@Query() paginationDto: CategoryPaginationDto) {
        return this.categorySerive.findAllPagination(paginationDto);
    }

    @Get('filter')
    findAllFilter(@Query() filterDto: CategoryFilterDto) {
        return this.categorySerive.findAllFilter(filterDto);
    }

    @Get(':id')
    findOne(@Param('id') id: ValidateObjectIdPipe) {
        return this.categorySerive.findOne(id);
    }

    @Patch(':id')
    async update(@Param('id') id: ValidateObjectIdPipe, @Body() updateCategoryDto: UpdateCategoryDto) {
        const updatedCategory = await this.categorySerive.update(id, updateCategoryDto);
        if(!updatedCategory) throw new HttpException('Category not found!', 400);
        return updatedCategory;
    }

    @Delete(':id')
    async remove(@Param('id') id: ValidateObjectIdPipe) {
        /*
            All Other Delete Actions will be placed here!
        */
        const deletedCategory = await this.categorySerive.remove(id);
        if(!deletedCategory) throw new HttpException('Category Not Found!', 400);
        return deletedCategory;
    }
}